let writer: WritableStreamDefaultWriter| undefined = undefined;

export function setWriter(_writer: WritableStreamDefaultWriter) {
    writer = _writer;
}

export default writer;