export const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

export const initialCartState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0
};

/**
 * Calculate cart totals from items array
 * @param {Array} items 
 * @returns {Object}
 */
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const unitPrice = item.unitPrice || item.price || 0;
    return sum + (unitPrice * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

/**
 * @param {Object} state - Current cart state
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New cart state
 */
export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case CART_ACTIONS.SET_CART:
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        loading: false,
        error: null
      };

    case CART_ACTIONS.ADD_ITEM:
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === newItem.productId
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
      }

      const addTotals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalItems: addTotals.totalItems,
        totalPrice: addTotals.totalPrice,
        error: null
      };

    case CART_ACTIONS.UPDATE_ITEM:
      const { itemId, quantity } = action.payload;
      const updateItems = state.items.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPayable: (item.unitPrice || item.price) * quantity }
          : item
      );

      const updateTotals = calculateTotals(updateItems);
      return {
        ...state,
        items: updateItems,
        totalItems: updateTotals.totalItems,
        totalPrice: updateTotals.totalPrice,
        error: null
      };

    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const removeTotals = calculateTotals(filteredItems);
      return {
        ...state,
        items: filteredItems,
        totalItems: removeTotals.totalItems,
        totalPrice: removeTotals.totalPrice,
        error: null
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        error: null
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export const cartActions = {
  setLoading: (loading) => ({
    type: CART_ACTIONS.SET_LOADING,
    payload: loading
  }),

  setCart: (items) => ({
    type: CART_ACTIONS.SET_CART,
    payload: items
  }),

  addItem: (item) => ({
    type: CART_ACTIONS.ADD_ITEM,
    payload: item
  }),

  updateItem: (itemId, quantity) => ({
    type: CART_ACTIONS.UPDATE_ITEM,
    payload: { itemId, quantity }
  }),

  removeItem: (itemId) => ({
    type: CART_ACTIONS.REMOVE_ITEM,
    payload: itemId
  }),

  clearCart: () => ({
    type: CART_ACTIONS.CLEAR_CART
  }),

  setError: (error) => ({
    type: CART_ACTIONS.SET_ERROR,
    payload: error
  }),

  clearError: () => ({
    type: CART_ACTIONS.CLEAR_ERROR
  })
};
