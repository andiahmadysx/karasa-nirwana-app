import {
    AlertCircleIcon,
    FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
    FormControlHelper,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField
} from "@gluestack-ui/themed";
import {SIZES} from "../../constants";
import {Controller} from "react-hook-form";

const renderFormControl = (name, label, placeholder, type = 'text', handleChange = () => {
}) => (
    <FormControl size="md" isDisabled={false} isInvalid={!!errors[name]} isReadOnly={false} isRequired={true}>
        <FormControlLabel mb='$1'>
            <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
            <Controller
                control={control}
                name={name}
                render={({field}) => (
                    <InputField
                        type={type}
                        placeholder={placeholder}
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e.nativeEvent.text)
                            handleChange(e.nativeEvent.text);
                        }}
                    />
                )}
            />
        </Input>
        <FormControlHelper></FormControlHelper>
        <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon}/>
            <FormControlErrorText>{errors[name]?.message}</FormControlErrorText>
        </FormControlError>
    </FormControl>
);
