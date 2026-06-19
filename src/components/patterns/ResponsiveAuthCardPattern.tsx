"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../inputs/Button"
import { Checkbox } from "../inputs/Checkbox"
import {
    Form,
    FormDescription,
    FormField,
    FormGroup,
    FormLabel,
    FormMessage,
} from "../inputs/Form"
import { Input } from "../inputs/Input"
import { PasswordInput } from "../inputs/PasswordInput"
import {
    PasswordRequirementList,
    type PasswordRequirement,
} from "../inputs/PasswordRequirementList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../navigation/Tabs"
import { TextLink } from "../navigation/TextLink"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../display/Card"

type AuthMode = "sign-in" | "create"

export type ResponsiveAuthCardPatternSignInValues = {
    email: string
    password: string
    remember: boolean
}

export type ResponsiveAuthCardPatternCreateAccountValues = {
    name: string
    email: string
    password: string
}

export type ResponsiveAuthCardPatternValidationLabels = {
    emailRequired: string
    emailInvalid: string
    passwordRequired: string
    nameRequired: string
    passwordWeak: string
    passwordMismatch: string
}

export type ResponsiveAuthCardPatternLabels = {
    signInTab: string
    createTab: string
    emailLabel: string
    passwordLabel: string
    nameLabel: string
    confirmLabel: string
    rememberLabel: string
    rememberAriaLabel: string
    forgotPassword: string
    signInButton: string
    createButton: string
    passwordHint: string
    termsPrefix: string
    terms: string
    and: string
    privacy: string
    termsSuffix: string
    emailPlaceholder: string
    passwordPlaceholder: string
    namePlaceholder: string
    createPasswordPlaceholder: string
    confirmPlaceholder: string
    passwordRequirementLength: string
    passwordRequirementCase: string
    passwordRequirementNumber: string
    validation: ResponsiveAuthCardPatternValidationLabels
}

export interface ResponsiveAuthCardPatternProps
    extends React.HTMLAttributes<HTMLElement> {
    brandName?: React.ReactNode
    description?: React.ReactNode
    defaultMode?: AuthMode
    signInTitle?: React.ReactNode
    signInDescription?: React.ReactNode
    createTitle?: React.ReactNode
    createDescription?: React.ReactNode
    termsHref?: string
    privacyHref?: string
    forgotPasswordHref?: string
    labels?: Partial<
        Omit<ResponsiveAuthCardPatternLabels, "validation"> & {
            validation: Partial<ResponsiveAuthCardPatternValidationLabels>
        }
    >
    onSignIn?: (values: ResponsiveAuthCardPatternSignInValues) => void
    onCreateAccount?: (values: ResponsiveAuthCardPatternCreateAccountValues) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_AUTH_LABELS: ResponsiveAuthCardPatternLabels = {
    signInTab: "ログイン",
    createTab: "アカウント作成",
    emailLabel: "メールアドレス",
    passwordLabel: "パスワード",
    nameLabel: "お名前",
    confirmLabel: "パスワード（確認）",
    rememberLabel: "このデバイスを記憶する",
    rememberAriaLabel: "このデバイスを記憶する",
    forgotPassword: "パスワードをお忘れですか？",
    signInButton: "ログイン",
    createButton: "アカウントを作成",
    passwordHint: "8文字以上、英大文字・英小文字・数字を含めてください。",
    termsPrefix: "続けることで",
    terms: "利用規約",
    and: "と",
    privacy: "プライバシーポリシー",
    termsSuffix: "に同意したものとみなされます。",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "パスワードを入力",
    namePlaceholder: "群青 花子",
    createPasswordPlaceholder: "パスワードを作成",
    confirmPlaceholder: "もう一度パスワードを入力",
    passwordRequirementLength: "8文字以上",
    passwordRequirementCase: "英大文字と英小文字を含む",
    passwordRequirementNumber: "数字を含む",
    validation: {
        emailRequired: "メールアドレスを入力してください。",
        emailInvalid: "有効なメールアドレスを入力してください。",
        passwordRequired: "パスワードを入力してください。",
        nameRequired: "お名前を入力してください。",
        passwordWeak: "パスワードの条件を満たしていません。",
        passwordMismatch: "パスワードが一致しません。",
    },
}

function resolveAuthLabels(
    labels: ResponsiveAuthCardPatternProps["labels"]
): ResponsiveAuthCardPatternLabels {
    return {
        ...DEFAULT_AUTH_LABELS,
        ...labels,
        validation: {
            ...DEFAULT_AUTH_LABELS.validation,
            ...labels?.validation,
        },
    }
}

function buildPasswordRequirements(
    password: string,
    labels: ResponsiveAuthCardPatternLabels
): PasswordRequirement[] {
    return [
        {
            id: "length",
            label: labels.passwordRequirementLength,
            met: password.length >= 8,
        },
        {
            id: "case",
            label: labels.passwordRequirementCase,
            met: /[a-z]/.test(password) && /[A-Z]/.test(password),
        },
        {
            id: "number",
            label: labels.passwordRequirementNumber,
            met: /\d/.test(password),
        },
    ]
}

export function ResponsiveAuthCardPattern({
    className,
    brandName = "Gunjo Studio",
    description = "ログインまたはアカウント作成をして続けます。",
    defaultMode = "sign-in",
    signInTitle = "おかえりなさい",
    signInDescription = "ワークスペースにアクセスするためログインしてください。",
    createTitle = "アカウントを作成",
    createDescription = "必要な情報を入力してワークスペースを始めます。",
    termsHref = "#",
    privacyHref = "#",
    forgotPasswordHref = "#",
    labels: labelsProp,
    onSignIn,
    onCreateAccount,
    ...props
}: ResponsiveAuthCardPatternProps) {
    const labels = React.useMemo(() => resolveAuthLabels(labelsProp), [labelsProp])
    const [mode, setMode] = React.useState<AuthMode>(defaultMode)
    const [signInEmail, setSignInEmail] = React.useState("")
    const [signInPassword, setSignInPassword] = React.useState("")
    const [remember, setRemember] = React.useState(false)
    const [signInSubmitted, setSignInSubmitted] = React.useState(false)
    const [name, setName] = React.useState("")
    const [createEmail, setCreateEmail] = React.useState("")
    const [createPassword, setCreatePassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [createSubmitted, setCreateSubmitted] = React.useState(false)
    const requirements = React.useMemo(
        () => buildPasswordRequirements(createPassword, labels),
        [createPassword, labels]
    )
    const passwordReady = requirements.every((requirement) => requirement.met)
    const normalizedSignInEmail = signInEmail.trim()
    const normalizedCreateEmail = createEmail.trim()
    const normalizedName = name.trim()

    const signInEmailError =
        signInSubmitted && !normalizedSignInEmail
            ? labels.validation.emailRequired
            : signInSubmitted && !EMAIL_RE.test(normalizedSignInEmail)
              ? labels.validation.emailInvalid
              : null
    const signInPasswordError =
        signInSubmitted && !signInPassword
            ? labels.validation.passwordRequired
            : null
    const nameError =
        createSubmitted && !normalizedName ? labels.validation.nameRequired : null
    const createEmailError =
        createSubmitted && !normalizedCreateEmail
            ? labels.validation.emailRequired
            : createSubmitted && !EMAIL_RE.test(normalizedCreateEmail)
              ? labels.validation.emailInvalid
              : null
    const createPasswordError =
        createSubmitted && !passwordReady
            ? labels.validation.passwordWeak
            : null
    const confirmPasswordError =
        createSubmitted && confirmPassword !== createPassword
            ? labels.validation.passwordMismatch
            : null

    function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSignInSubmitted(true)

        if (
            !normalizedSignInEmail ||
            !EMAIL_RE.test(normalizedSignInEmail) ||
            !signInPassword
        ) {
            return
        }

        onSignIn?.({
            email: normalizedSignInEmail,
            password: signInPassword,
            remember,
        })
    }

    function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setCreateSubmitted(true)

        if (
            !normalizedName ||
            !normalizedCreateEmail ||
            !EMAIL_RE.test(normalizedCreateEmail) ||
            !passwordReady ||
            confirmPassword !== createPassword
        ) {
            return
        }

        onCreateAccount?.({
            name: normalizedName,
            email: normalizedCreateEmail,
            password: createPassword,
        })
    }

    return (
        <main
            className={cn(
                "flex h-fit min-h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4 py-10 text-foreground",
                className
            )}
            {...props}
        >
            <div className="flex w-full max-w-md flex-col gap-6">
                <header className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">{brandName}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </header>

                <Tabs
                    value={mode}
                    onValueChange={(value) => setMode(value as AuthMode)}
                    className="w-full border-0 p-0"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="sign-in" className="flex-1">
                            {labels.signInTab}
                        </TabsTrigger>
                        <TabsTrigger value="create" className="flex-1">
                            {labels.createTab}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in" className="px-0">
                        <Card>
                            <Form noValidate onSubmit={handleSignInSubmit}>
                                <CardHeader>
                                    <CardTitle>{signInTitle}</CardTitle>
                                    <CardDescription>{signInDescription}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5">
                                    <FormField className="p-0">
                                        <FormGroup>
                                            <FormLabel htmlFor="auth-sign-in-email">
                                                {labels.emailLabel}
                                            </FormLabel>
                                            <Input
                                                id="auth-sign-in-email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder={labels.emailPlaceholder}
                                                value={signInEmail}
                                                onChange={(event) =>
                                                    setSignInEmail(event.target.value)
                                                }
                                                aria-invalid={Boolean(signInEmailError)}
                                                aria-label={labels.emailLabel}
                                            />
                                            {signInEmailError ? (
                                                <FormMessage>{signInEmailError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <FormField className="p-0">
                                        <FormGroup>
                                            <div className="flex items-center justify-between gap-3">
                                                <FormLabel htmlFor="auth-sign-in-password">
                                                    {labels.passwordLabel}
                                                </FormLabel>
                                                <TextLink href={forgotPasswordHref} className="text-xs">
                                                    {labels.forgotPassword}
                                                </TextLink>
                                            </div>
                                            <PasswordInput
                                                id="auth-sign-in-password"
                                                autoComplete="current-password"
                                                placeholder={labels.passwordPlaceholder}
                                                value={signInPassword}
                                                onChange={(event) =>
                                                    setSignInPassword(event.target.value)
                                                }
                                                aria-invalid={Boolean(signInPasswordError)}
                                                aria-label={labels.passwordLabel}
                                            />
                                            {signInPasswordError ? (
                                                <FormMessage>{signInPasswordError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={remember}
                                            onCheckedChange={(checked) =>
                                                setRemember(checked === true)
                                            }
                                            aria-label={labels.rememberAriaLabel}
                                        />
                                        <span>{labels.rememberLabel}</span>
                                    </label>

                                    <Button type="submit" variant="primary" className="w-full">
                                        {labels.signInButton}
                                    </Button>
                                </CardContent>
                            </Form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="create" className="px-0">
                        <Card>
                            <Form noValidate onSubmit={handleCreateSubmit}>
                                <CardHeader>
                                    <CardTitle>{createTitle}</CardTitle>
                                    <CardDescription>{createDescription}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5">
                                    <FormField className="p-0">
                                        <FormGroup>
                                            <FormLabel htmlFor="auth-create-name">
                                                {labels.nameLabel}
                                            </FormLabel>
                                            <Input
                                                id="auth-create-name"
                                                autoComplete="name"
                                                placeholder={labels.namePlaceholder}
                                                value={name}
                                                onChange={(event) =>
                                                    setName(event.target.value)
                                                }
                                                aria-invalid={Boolean(nameError)}
                                                aria-label={labels.nameLabel}
                                            />
                                            {nameError ? (
                                                <FormMessage>{nameError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <FormField className="p-0">
                                        <FormGroup>
                                            <FormLabel htmlFor="auth-create-email">
                                                {labels.emailLabel}
                                            </FormLabel>
                                            <Input
                                                id="auth-create-email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder={labels.emailPlaceholder}
                                                value={createEmail}
                                                onChange={(event) =>
                                                    setCreateEmail(event.target.value)
                                                }
                                                aria-invalid={Boolean(createEmailError)}
                                                aria-label={labels.emailLabel}
                                            />
                                            {createEmailError ? (
                                                <FormMessage>{createEmailError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <FormField className="p-0">
                                        <FormGroup>
                                            <FormLabel htmlFor="auth-create-password">
                                                {labels.passwordLabel}
                                            </FormLabel>
                                            <PasswordInput
                                                id="auth-create-password"
                                                autoComplete="new-password"
                                                placeholder={labels.createPasswordPlaceholder}
                                                value={createPassword}
                                                onChange={(event) =>
                                                    setCreatePassword(event.target.value)
                                                }
                                                aria-invalid={Boolean(createPasswordError)}
                                                aria-label={labels.passwordLabel}
                                            />
                                            <FormDescription>
                                                {labels.passwordHint}
                                            </FormDescription>
                                            {createPassword ? (
                                                <PasswordRequirementList
                                                    requirements={requirements}
                                                />
                                            ) : null}
                                            {createPasswordError ? (
                                                <FormMessage>{createPasswordError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <FormField className="p-0">
                                        <FormGroup>
                                            <FormLabel htmlFor="auth-create-confirm">
                                                {labels.confirmLabel}
                                            </FormLabel>
                                            <PasswordInput
                                                id="auth-create-confirm"
                                                autoComplete="new-password"
                                                placeholder={labels.confirmPlaceholder}
                                                value={confirmPassword}
                                                onChange={(event) =>
                                                    setConfirmPassword(event.target.value)
                                                }
                                                aria-invalid={Boolean(confirmPasswordError)}
                                                aria-label={labels.confirmLabel}
                                            />
                                            {confirmPasswordError ? (
                                                <FormMessage>{confirmPasswordError}</FormMessage>
                                            ) : null}
                                        </FormGroup>
                                    </FormField>

                                    <Button type="submit" variant="primary" className="w-full">
                                        {labels.createButton}
                                    </Button>
                                </CardContent>
                            </Form>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="text-center text-xs text-muted-foreground">
                    {labels.termsPrefix}{" "}
                    <TextLink href={termsHref} className="text-xs">
                        {labels.terms}
                    </TextLink>{" "}
                    {labels.and}{" "}
                    <TextLink href={privacyHref} className="text-xs">
                        {labels.privacy}
                    </TextLink>
                    {labels.termsSuffix}
                </p>
            </div>
        </main>
    )
}
