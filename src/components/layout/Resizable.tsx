"use client"

import * as React from "react"
import { IconGripVertical as GripVertical } from "@tabler/icons-react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle, type GroupImperativeHandle, type GroupProps } from "react-resizable-panels"

import { cn } from "../../lib/utils"

type ResizablePanelGroupProps = Omit<GroupProps, "orientation"> & {
    direction: "vertical" | "horizontal"
}

const ResizablePanelGroupResetContext = React.createContext<(() => void) | null>(null)

const ResizablePanelGroup = ({
    className,
    direction,
    defaultLayout,
    groupRef,
    ...props
}: ResizablePanelGroupProps) => {
    const internalGroupRef = React.useRef<GroupImperativeHandle | null>(null)
    const setGroupRef = React.useCallback((node: GroupImperativeHandle | null) => {
        internalGroupRef.current = node

        if (typeof groupRef === "function") {
            groupRef(node)
            return
        }

        if (groupRef) {
            (groupRef as React.MutableRefObject<GroupImperativeHandle | null>).current = node
        }
    }, [groupRef])
    const resetLayout = React.useCallback(() => {
        if (defaultLayout) {
            internalGroupRef.current?.setLayout(defaultLayout)
        }
    }, [defaultLayout])

    return (
        <ResizablePanelGroupResetContext.Provider value={defaultLayout ? resetLayout : null}>
            <PanelGroup
                groupRef={setGroupRef}
                defaultLayout={defaultLayout}
                orientation={direction}
                className={cn(
                    "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
                    className
                )}
                {...props}
            />
        </ResizablePanelGroupResetContext.Provider>
    )
}

const ResizablePanel = Panel

const ResizableHandle = ({
    withHandle,
    className,
    onDoubleClick,
    ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
    withHandle?: boolean
}) => {
    const resetLayout = React.useContext(ResizablePanelGroupResetContext)
    const handleDoubleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        onDoubleClick?.(event)

        if (!event.defaultPrevented) {
            resetLayout?.()
        }
    }, [onDoubleClick, resetLayout])

    return (
        <PanelResizeHandle
            className={cn(
                "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[aria-orientation=horizontal]]:h-px [&[aria-orientation=horizontal]]:w-full [&[aria-orientation=horizontal]]:after:left-0 [&[aria-orientation=horizontal]]:after:top-1/2 [&[aria-orientation=horizontal]]:after:h-1 [&[aria-orientation=horizontal]]:after:w-full [&[aria-orientation=horizontal]]:after:-translate-y-1/2 [&[aria-orientation=horizontal]]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
                className
            )}
            onDoubleClick={handleDoubleClick}
            {...props}
        >
            {withHandle && (
                <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                    <GripVertical className="h-2.5 w-2.5" />
                </div>
            )}
        </PanelResizeHandle>
    )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
