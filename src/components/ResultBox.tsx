interface ResultBoxProps {
    result: string | null;
}

export default function ResultBox({ result }: ResultBoxProps) {
    if (!result) {
        return null;
    }

    return (
        <div className="result-box">
            <h3>생성 결과</h3>
            <pre>{result}</pre>
        </div>
    );
}
