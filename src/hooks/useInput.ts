import { useState, ChangeEvent } from "react";

export function useInput(initialValue: string = "") {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | string
  ) => {
    if (typeof e === "string") {
      setValue(e);
    } else if (e && e.target !== undefined) {
      setValue(e.target.value);
    }
  };

  const reset = () => {
    setValue(initialValue);
  };

  const result = [value, onChange, setValue, reset] as [
    string,
    typeof onChange,
    typeof setValue,
    typeof reset
  ] & {
    value: string;
    onChange: typeof onChange;
    setValue: typeof setValue;
    reset: typeof reset;
  };

  result.value = value;
  result.onChange = onChange;
  result.setValue = setValue;
  result.reset = reset;

  return result;
}

export default useInput;
