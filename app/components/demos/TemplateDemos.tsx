"use client";

import {
    DashboardTemplate,
    EditorTemplate,
    SettingsTemplate,
    AuthTemplate,
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    SidebarItem,
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    SpatialCanvas,
    KanbanTemplate,
    LandingTemplate,
    ChatTemplate,
} from "@gunjo/ui";
import {
    IconBox as Box,
    IconDots as MoreHorizontal,
    IconInfoCircle as Info,
    IconLayoutDashboard as LayoutDashboard,
    IconPhone as Phone,
    IconPlus as Plus,
    IconPointer as MousePointer2,
    IconSend as Send,
    IconSettings as Settings,
    IconStack2 as Layers,
    IconUser as User,
    IconVideo as Video,
} from "@tabler/icons-react";

export function DashboardTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <DashboardTemplate
                // Simplified header for demo
                header={
                    <div className="h-16 flex items-center px-6 justify-between bg-card">
                        <div className="font-bold text-lg">Acme Dashboard</div>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted"></div>
                        </div>
                    </div>
                }
                sidebar={
                    <div className="h-full py-4 bg-card">
                        <SidebarItem icon={<LayoutDashboard size={20} />} isActive={true} onClick={() => { }} id="overview" label="Overview" />
                        <SidebarItem icon={<User size={20} />} isActive={false} onClick={() => { }} id="customers" label="Customers" />
                        <SidebarItem icon={<Settings size={20} />} isActive={false} onClick={() => { }} id="settings" label="Settings" />
                    </div>
                }
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                        <Card className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-muted-foreground">+19% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">+201 since last hour</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                        <Card className="col-span-4 w-full">
                            <CardHeader>
                                <CardTitle>Sales Analytics</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                                <span className="text-muted-foreground">Chart Placeholder</span>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 w-full">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$1,999.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$39.00</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardTemplate>
        </div>
    )
}

export function EditorTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <EditorTemplate
                topBar={
                    <div className="w-full flex items-center px-4 justify-between">
                        <div className="flex items-center gap-4">
                            <Menubar className="border-none">
                                <MenubarMenu>
                                    <MenubarTrigger>File</MenubarTrigger>
                                </MenubarMenu>
                                <MenubarMenu>
                                    <MenubarTrigger>Edit</MenubarTrigger>
                                </MenubarMenu>
                                <MenubarMenu>
                                    <MenubarTrigger>View</MenubarTrigger>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                        <div className="text-sm font-medium">Untitled Design</div>
                        <div className="flex gap-2">
                            <Button size="sm">Share</Button>
                        </div>
                    </div>
                }
                leftPanel={
                    <div className="h-full p-2 border-r bg-card space-y-4">
                        <div className="text-xs font-semibold px-2 text-muted-foreground uppercase">Layers</div>
                        <div className="space-y-1">
                            <div className="px-2 py-1 text-sm bg-accent rounded cursor-pointer">Reatangle 1</div>
                            <div className="px-2 py-1 text-sm cursor-pointer">Ellipse 2</div>
                            <div className="px-2 py-1 text-sm cursor-pointer">Text Layer</div>
                        </div>
                    </div>
                }
                rightPanel={
                    <div className="h-full p-4 border-l bg-card">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-4">Properties</div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Width</Label>
                                <Input defaultValue="100%" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Height</Label>
                                <Input defaultValue="100%" />
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="w-full h-full relative">
                    <SpatialCanvas gridSize={20}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-96 h-64 bg-background shadow-lg rounded-lg border flex items-center justify-center text-muted-foreground">
                                Artboard
                            </div>
                        </div>
                    </SpatialCanvas>
                    {/* Floating Toolbar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground rounded-full shadow-xl border px-4 py-2 flex gap-4">
                        <MousePointer2 size={20} className="text-primary" />
                        <Box size={20} className="text-muted-foreground" />
                        <Layers size={20} className="text-muted-foreground" />
                    </div>
                </div>
            </EditorTemplate>
        </div>
    )
}

export function SettingsTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <SettingsTemplate
                navigation={
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <Button variant="secondary" className="justify-start">Profile</Button>
                        <Button variant="ghost" className="justify-start">Account</Button>
                        <Button variant="ghost" className="justify-start">Appearance</Button>
                        <Button variant="ghost" className="justify-start">Notifications</Button>
                        <Button variant="ghost" className="justify-start">Display</Button>
                    </nav>
                }
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Profile</h3>
                        <p className="text-sm text-muted-foreground">
                            This is how others will see you on the site.
                        </p>
                    </div>
                    <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
                    <form className="space-y-8">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input placeholder="shadcn" />
                            <p className="text-[0.8rem] text-muted-foreground">
                                This is your public display name. It can be your real name or a pseudonym.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input placeholder="m@example.com" />
                            <p className="text-[0.8rem] text-muted-foreground">
                                You can manage verified email addresses in your email settings.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Input />
                            <p className="text-[0.8rem] text-muted-foreground">
                                You can manage verified email addresses in your email settings.
                            </p>
                        </div>
                        <Button>Update profile</Button>
                    </form>
                </div>
            </SettingsTemplate>
        </div>
    )
}

export function AuthTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <AuthTemplate>
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to create your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <form>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                />
                            </div>
                            <Button>
                                Sign In with Email
                            </Button>
                        </div>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" type="button">
                        GitHub
                    </Button>
                </div>
            </AuthTemplate>
        </div>
    )
}

export function KanbanTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <KanbanTemplate
                sidebar={
                    <div className="h-full py-4 bg-card">
                        <div className="px-4 mb-4 flex items-center justify-between">
                            <span className="font-semibold text-sm">Projects</span>
                            <Plus size={16} className="text-muted-foreground" />
                        </div>
                        <SidebarItem icon={<Box size={20} />} isActive={true} onClick={() => { }} id="board-1" label="Product Launch" />
                        <SidebarItem icon={<Box size={20} />} isActive={false} onClick={() => { }} id="board-2" label="Marketing" />
                        <SidebarItem icon={<Box size={20} />} isActive={false} onClick={() => { }} id="board-3" label="Hiring" />
                    </div>
                }
                header={
                    <div className="flex items-center justify-between w-full">
                        <div className="font-semibold">Product Launch</div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs text-primary-foreground">JD</div>
                                <div className="h-8 w-8 rounded-full bg-accent border-2 border-background flex items-center justify-center text-xs text-accent-foreground">SM</div>
                                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">+3</div>
                            </div>
                            <Button size="sm" variant="outline">Share</Button>
                        </div>
                    </div>
                }
            >
                {/* Column 1 */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="font-medium text-sm text-muted-foreground">To Do</span>
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                    </div>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">Research Competitors</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                            Analyze top 3 competitors in the market.
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <div className="bg-destructive-subtle text-destructive-subtle-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">High</div>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">Draft PRD</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                            Initial draft of product requirements.
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2 */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="font-medium text-sm text-muted-foreground">In Progress</span>
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                    </div>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">Design System</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                            Standardizing component tokens.
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <div className="bg-primary-subtle text-primary-subtle-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">Design</div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Column 3 */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="font-medium text-sm text-muted-foreground">Done</span>
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                    </div>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">User Interviews</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                            Completed 10 initial user interviews.
                        </CardContent>
                    </Card>
                </div>
            </KanbanTemplate>
        </div>
    )
}

export function LandingTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <LandingTemplate
                header={
                    <div className="w-full flex items-center justify-between">
                        <div className="font-bold text-lg">Acme Inc.</div>
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <span className="text-muted-foreground">Features</span>
                            <span className="text-muted-foreground">Pricing</span>
                            <span className="text-muted-foreground">About</span>
                            <span className="text-muted-foreground">Blog</span>
                        </nav>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="sm">Log in</Button>
                            <Button size="sm">Sign up</Button>
                        </div>
                    </div>
                }
                hero={
                    <div className="container flex flex-col items-center gap-4 text-center py-10 md:py-20">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                            New Release v2.0 is out
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                            Build your next idea <br className="hidden md:block" /> with speed and style.
                        </h1>
                        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                            Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <Button size="lg">Get Started</Button>
                            <Button size="lg" variant="outline">View on GitHub</Button>
                        </div>
                    </div>
                }
                features={
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: "Customizable", desc: "Change colors, fonts, and layouts with ease." },
                            { title: "Accessible", desc: "Built with ARIA standards and keyboard navigation." },
                            { title: "Dark Mode", desc: "Automatic dark mode support out of the box." },
                            { title: "TypeScript", desc: "Fully typed for better developer experience." },
                            { title: "Modern Stack", desc: "Built with Next.js, Tailwind CSS, and Radix UI." },
                            { title: "Open Source", desc: "Free to use and modify for personal or commercial projects." }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col gap-2 p-6 border rounded-lg bg-card">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground mb-2">
                                    <Box size={20} />
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                }
                cta={
                    <div className="container py-12 md:py-24">
                        <div className="flex flex-col items-center gap-4 text-center bg-primary text-primary-foreground rounded-2xl p-10 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
                            <p className="text-lg opacity-90 max-w-[600px]">
                                Join thousands of developers building the future of the web with our tools.
                            </p>
                            <Button size="lg" variant="secondary" className="mt-4">
                                Start Building Now
                            </Button>
                        </div>
                    </div>
                }
                footer={
                    <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                        <p>© 2024 Acme Inc. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <span>Terms</span>
                            <span>Privacy</span>
                            <span>Contact</span>
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export function ChatTemplateDemo() {
    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-xl transform scale-90 origin-top bg-background flex flex-col">
            <ChatTemplate
                sidebarList={
                    <div className="h-full py-4 bg-card flex flex-col gap-2">
                        <div className="px-4 mb-2">
                            <Input placeholder="Search..." className="h-8" />
                        </div>
                        <div className="px-2">
                            <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">Direct Messages</div>
                            <SidebarItem icon={<div className="h-2 w-2 rounded-full bg-primary" />} isActive={true} onClick={() => { }} id="user-1" label="Alice Smith" />
                            <SidebarItem icon={<div className="h-2 w-2 rounded-full bg-muted" />} isActive={false} onClick={() => { }} id="user-2" label="Bob Jones" />
                            <SidebarItem icon={<div className="h-2 w-2 rounded-full bg-primary" />} isActive={false} onClick={() => { }} id="user-3" label="Charlie Day" />
                        </div>
                        <div className="px-2 mt-4">
                            <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">Channels</div>
                            <SidebarItem icon={<Box size={16} />} isActive={false} onClick={() => { }} id="ch-1" label="#general" />
                            <SidebarItem icon={<Box size={16} />} isActive={false} onClick={() => { }} id="ch-2" label="#random" />
                        </div>
                    </div>
                }
                header={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-strong flex items-center justify-center text-primary-foreground text-xs font-bold">AS</div>
                            <div>
                                <div className="text-sm font-semibold">Alice Smith</div>
                                <div className="text-xs text-primary flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Active now
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Phone size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Video size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Info size={18} /></Button>
                        </div>
                    </div>
                }
                composer={
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="shrink-0"><Plus size={20} /></Button>
                        <Input placeholder="Type a message..." className="flex-1" />
                        <Button size="icon" className="shrink-0"><Send size={18} /></Button>
                    </div>
                }
                sidebarDetail={
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-primary-strong flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">AS</div>
                        <h3 className="font-bold text-lg">Alice Smith</h3>
                        <p className="text-sm text-muted-foreground">Product Designer</p>

                        <div className="w-full mt-6 space-y-4 text-left">
                            <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Email</div>
                                <div className="text-sm">alice@example.com</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Location</div>
                                <div className="text-sm">San Francisco, CA</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Shared Files</div>
                                <div className="text-sm text-primary hover:underline cursor-pointer">Project_Specs.pdf</div>
                                <div className="text-sm text-primary hover:underline cursor-pointer">Assets.zip</div>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-strong flex-shrink-0 flex items-center justify-center text-primary-foreground text-xs font-bold">AS</div>
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-sm max-w-[80%] text-sm">
                            Hey! Have you seen the new design system updates?
                        </div>
                    </div>
                    <div className="flex items-end gap-2 justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm">
                            Yes! It looks amazing. I love the new color palette.
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-strong flex-shrink-0 flex items-center justify-center text-primary-foreground text-xs font-bold">AS</div>
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-sm max-w-[80%] text-sm">
                            Great! Let&apos;s start implementing the new components.
                        </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground my-2">Today 9:41 AM</div>
                    <div className="flex items-end gap-2 justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm">
                            I&apos;m on it. Just finished the Landing Page template.
                        </div>
                    </div>
                </div>
            </ChatTemplate>
        </div>
    )
}
