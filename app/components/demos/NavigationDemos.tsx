"use client";

import React from "react";
import { enUS } from "date-fns/locale/en-US";
import { ja } from "date-fns/locale/ja";
import {
    Tabs, TabsList, TabsTrigger, TabsContent,
    Accordion, AccordionItem, AccordionTrigger, AccordionContent,
    Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut,
    Calendar,
    Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label
} from "@gunjo/ui";
import {
    IconCalculator as Calculator,
    IconCalendar as CalendarIcon,
    IconCreditCard as CreditCard,
    IconMoodSmile as Smile,
    IconSettings as Settings,
    IconUser as User,
} from "@tabler/icons-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function TabsDemo() {
    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export function AccordionDemo() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that matches the other components' aesthetic.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export function CommandDemo() {
    const { locale } = useLocale();

    return (
        <Command className="rounded-lg border shadow-md w-[450px]">
            <CommandInput
                placeholder={locale === "ja" ? "コマンドまたは検索語を入力..." : "Type a command or search..."}
                clearable
                clearLabel={locale === "ja" ? "検索をクリア" : "Clear search"}
            />
            <CommandList>
                <CommandEmpty>{locale === "ja" ? "一致する結果がありません。" : "No results found."}</CommandEmpty>
                <CommandGroup heading={locale === "ja" ? "候補" : "Suggestions"}>
                    <CommandItem>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "カレンダー" : "Calendar"}</span>
                    </CommandItem>
                    <CommandItem>
                        <Smile className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "絵文字を検索" : "Search Emoji"}</span>
                    </CommandItem>
                    <CommandItem>
                        <Calculator className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "計算機" : "Calculator"}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading={locale === "ja" ? "設定" : "Settings"}>
                    <CommandItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "プロフィール" : "Profile"}</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "請求" : "Billing"}</span>
                        <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{locale === "ja" ? "環境設定" : "Settings"}</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

export function CalendarDemo() {
    const { locale } = useLocale();
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 4, 4))
    const calendarLocale = locale === "ja" ? ja : enUS

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={new Date(2026, 4, 1)}
            locale={calendarLocale}
            className="rounded-md border"
        />
    )
}
