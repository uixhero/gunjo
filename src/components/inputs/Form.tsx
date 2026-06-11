import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const formFieldVariants = cva("flex flex-col gap-1.5 p-4")
const formGroupVariants = cva(
    "flex flex-col gap-1.5 p-0 [&_[data-slot=combobox]]:!w-full [&_[data-slot=date-picker]]:!w-full [&_[data-slot=date-range-picker]]:!w-full [&_[data-slot=editable-field]]:!w-full [&_[data-slot=file-uploader]]:!w-full [&_[data-slot=form-control]]:w-full [&_[data-slot=input]]:!w-full [&_[data-slot=input-otp]]:!w-full [&_[data-slot=mention]]:!w-full [&_[data-slot=number-input]]:!w-full [&_[data-slot=password-group]]:!w-full [&_[data-slot=password-input]]:!w-full [&_[data-slot=phone-input]]:!w-full [&_[data-slot=postal-code-input]]:!w-full [&_[data-slot=range-slider]]:!w-full [&_[data-slot=search-input]]:!w-full [&_[data-slot=select-control]]:!w-full [&_[data-slot=slider]]:!w-full [&_[data-slot=tag-input]]:!w-full [&_[data-slot=textarea]]:!w-full [&_[data-slot=time-picker]]:!w-full"
)

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(formFieldVariants(), className)} {...props} data-slot="form-field" />
    )
)
FormField.displayName = "FormField"

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(formGroupVariants(), className)} {...props} data-slot="form-group" />
    )
)
FormGroup.displayName = "FormGroup"

export interface FormLabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-sm font-medium leading-none text-foreground",
                className
            )}
            {...props}
            data-slot="form-label"
        />
    )
)
FormLabel.displayName = "FormLabel"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(className)} {...props} data-slot="form-control" />
    )
)
FormControl.displayName = "FormControl"

export interface FormDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    FormDescriptionProps
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-xs font-normal text-muted-foreground", className)}
        {...props}
        data-slot="form-description"
    />
))
FormDescription.displayName = "FormDescription"

export interface FormMessageProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-xs font-medium text-destructive", className)}
            {...props}
            data-slot="form-message"
        >
            {children}
        </p>
    )
)
FormMessage.displayName = "FormMessage"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
    ({ className, ...props }, ref) => (
        <form ref={ref} className={cn("flex flex-col gap-4", className)} {...props} data-slot="form" />
    )
)
Form.displayName = "Form"

export {
    Form,
    FormField,
    FormGroup,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    formFieldVariants,
    formGroupVariants,
}
