import { TextInput } from "react-native"

type InputProps = {
    value?: string;
    onBlur?: () => void;
    onChange?: (text: string) => void;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    placeholder?: string;
    keyboardType?: 'numeric';
    onFocus?: () => void;
    editable?: boolean;
}

export default function Input({ 
    value, onBlur, onChange, placeholder, onChangeText, keyboardType, onFocus, editable = true
}: InputProps) {
    return (
        <TextInput 
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            onFocus={onFocus}
            editable={editable}
            className="
                w-full
                rounded-xl
                px-5 py-4
                bg-ctp-surface0
                text-ctp-text
                placeholder:text-ctp-text
            "
        />
    )
}
