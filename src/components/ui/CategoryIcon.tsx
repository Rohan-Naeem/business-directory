import React from 'react';
import {
  Laptop,
  Stethoscope,
  Building2,
  HardHat,
  UtensilsCrossed,
  Scale,
  GraduationCap,
  Hotel,
  Car,
  Factory,
  ShoppingBag,
  Wrench,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Stethoscope':
      return <Stethoscope {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'HardHat':
      return <HardHat {...props} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />;
    case 'Scale':
      return <Scale {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Hotel':
      return <Hotel {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Factory':
      return <Factory {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    default:
      return <Building2 {...props} />;
  }
};
