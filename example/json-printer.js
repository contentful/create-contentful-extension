export default function JsonPrinter({ obj }) {
  return (
    <pre>{JSON.stringify(obj, null, 2)}</pre>
  );
}
