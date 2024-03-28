import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    Icon?: React.ComponentType;
}

export function Button({ title, onPress, variant = 'primary', Icon }: ButtonProps ) {
    const buttonClasses = clsx(
        'p-4 rounded-xl items-center justify-center',
        {
          'bg-ctp-blue': variant === 'primary',
          'bg-ctp-pink': variant === 'secondary',
          'bg-ctp-red': variant === 'danger',
        }
    );

    return (
        <TouchableOpacity onPress={onPress} className={buttonClasses}>
            {Icon && <Icon />}
            <Text className='font-semibold text-white dark:text-black text-center'>{title}</Text>
        </TouchableOpacity>
    );
}