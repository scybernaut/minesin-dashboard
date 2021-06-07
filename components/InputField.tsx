import { RefObject } from "react";
import { oneLine as l1 } from "common-tags";
import _uniqueId from "lodash/uniqueId";

export type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  inputProps?: Record<string, any>;
  onEnter?: (e?: { preventDefault: () => any }) => void;
  type?: string;
  id?: string;
  inputRef?: RefObject<HTMLInputElement>;
  error?: {
    text: string;
    highlight: boolean;
  };
  onChange?: () => void;
};

const InputField: React.FC<PasswordFieldProps> = (props) => {
  const type = props.type ?? "text";

  console.log(props.error);

  const inputProps: Record<string, string> = {};

  inputProps.placeholder = props.placeholder ?? props.label;

  Object.assign(inputProps, props.inputProps);

  const id = props.id ?? _uniqueId("field-");

  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-xl mb-2">
        {props.label}
      </label>
      <input
        className={l1`w-full py-2 px-4 rounded bg-gray-700 focus:outline-none focus:ring 
        ${props.error?.highlight ? "ring ring-red-500" : "focus:ring-primary-light"} 
        focus:ring-opacity-100`}
        type={type}
        id={id}
        ref={props.inputRef}
        {...inputProps}
        onChange={props.onChange}
        onKeyPress={(event) => event.key === "Enter" && props.onEnter?.(event)}
      />
      <p className="h-4 text-red-500 font-medium my-1 mb-2">
        {props.error?.text && props.error?.highlight ? props.error.text : ""}
      </p>
    </div>
  );
};

export default InputField;
