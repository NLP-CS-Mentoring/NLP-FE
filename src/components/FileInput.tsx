interface FileInputProps {
    onChange: (file: File) => void;
}

export default function FileInput({ onChange }: FileInputProps) {
    return (
        <div className="field">
            <label>스타일 파일 (PDF/TXT)</label>
            <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => e.target.files && onChange(e.target.files[0])}
            />
        </div>
    );
}
