import { Badge as BootstrapBadge } from 'react-bootstrap';
import { AlertCircle } from 'lucide-react';

const Badge = ({ bg, children, outOfStock }) => {
  if (outOfStock) {
    return (
      <BootstrapBadge bg={bg} className="me-2">
        <AlertCircle size={14} className="me-1" />
        {children}
      </BootstrapBadge>
    );
  }

  return (
    <BootstrapBadge bg={bg} className="me-2 stocks-badge">
      {children}
    </BootstrapBadge>
  );
};

export default Badge;
