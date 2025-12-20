interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function TextArea({ label, value, onChange }: TextAreaProps) {
    return (
        <div className="field">
            <label>{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}
