import { useEffect, useState } from "react";
import { oneLine as l1 } from "common-tags";
import _uniqueId from "lodash/uniqueId";

export type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  errorText?: string;
  inputProps?: Record<string, any>;
  valueSetter?: (password: string) => void;
  errorParity?: boolean;
  onEnter?: () => void;
  type?: string;
};

const InputField: React.FC<PasswordFieldProps> = (props) => {
  const [highlightError, setHighlightError] = useState<boolean>();
  useEffect(() => setHighlightError(!!props.errorText), [props.errorParity]);

  const type = props.type ?? "text";

  const inputProps: Record<string, string> = {};

  inputProps.placeholder = props.placeholder ?? props.label;

  Object.assign(inputProps, props.inputProps);

  const id = _uniqueId("field-");

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-semibold text-xl mb-2">
        {props.label}
      </label>
      <input
        className={l1`w-full py-2 px-4 rounded bg-gray-700 focus:outline-none focus:ring 
        ${highlightError ? "ring ring-red-500" : "focus:ring-primary-light"} 
        focus:ring-opacity-100`}
        type={type}
        id={id}
        {...inputProps}
        onChange={(event) => {
          setHighlightError(false);
          props.valueSetter?.(event.target.value);
        }}
        onKeyPress={(event) => event.key === "Enter" && props.onEnter?.()}
      />
      {highlightError && <p className="text-red-500 font-medium mt-1">{props.errorText}</p>}
    </div>
  );
};

export default InputField;
