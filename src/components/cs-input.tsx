import { Input as ShadcnInput } from "./ui/input";
import { Label } from "./ui/label";

type InputProps = React.ComponentProps<typeof ShadcnInput>;
type LabelProps = React.ComponentProps<typeof Label>;

export const Input = ({
  inputProps,
  labelProps,
  label,
  helperText,
}: {
  inputProps: InputProps;
  labelProps?: LabelProps;
  label?: string;
  helperText?: string;
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-y-2">
      {label && (
        <Label className="text-sm font-medium text-[#172554]" {...labelProps}>
          {label}
        </Label>
      )}
      <ShadcnInput
        className="flex h-12 items-center rounded-xl border-gray-300 px-4 py-3 text-gray-800"
        {...inputProps}
      />
      {helperText && (
        <span className="text-sm text-gray-700">{helperText}</span>
      )}
    </div>
  );
};
