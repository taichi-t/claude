interface Props {
  text: string;
  phrase?: string;
}

/** 本文中の決め手となる語句を <mark> で強調する */
export function Highlight({ text, phrase }: Props) {
  if (!phrase) return <>{text}</>;
  const index = text.indexOf(phrase);
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{phrase}</mark>
      {text.slice(index + phrase.length)}
    </>
  );
}
