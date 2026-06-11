#!/usr/bin/env python3
"""
Move a set of frames out of one or more source .pen files into a target
.pen file, preserving every node ID. Atomic-design → functional category
migration helper for issue #108.

The .pen format is plain JSON (not encrypted), so direct file
manipulation is safe AS LONG AS the node IDs are preserved in-place.
That's the whole point of this script — Pencil MCP regenerates IDs on
cross-file copy, which would invalidate the hardcoded title/desc lookup
in scripts/design-sync/sync-metadata.mjs. Direct JSON moves keep them.

Usage (run from repo root):
    python3 scripts/migrate-pen-category.py feedback

Each category is defined in CATEGORY_MOVES below: a list of items to
remove from source pens and append to the target pen.
"""

import json
import sys
from pathlib import Path

DESIGN = Path("design")

CATEGORY_MOVES = {
    "inputs": {
        "scaffold_id": "inputsRoot",
        "scaffold_name": "Inputs",
        "moves": [
            (
                "atoms",
                [
                    "buttonFrame", "inputFrame", "labelFrame", "checkboxFrame",
                    "switchFrame", "textareaFrame", "radioGroupFrame",
                    "sliderFrame", "selectFrame", "toggleGroupFrame",
                    "lt4dz", "w9AIN", "W494H",  # Toggle variants
                    "TFYea", "P9nWV", "ppOzu", "O3YMzw",  # NumberInput, PasswordInput, SearchInput, InputOTP
                    "thTjM", "j38LFp", "rne63", "J5BDKM", "N4befa",  # showcase frames for toggle/numberInput/passwordInput/searchInput/inputOTP
                    "pbjEb", "WZBem", "Mpuvz", "C1jkC5", "bUxMa", "yPJde",
                    "WQfCn", "LK3RR", "kx5mQ", "E2aqLz",  # showcases for section components
                ],
            ),
            (
                "molecules",
                [
                    "calendarFrame", "filterButtonFrame", "sortButtonFrame",
                    "lHxx4", "yg1jf", "Fpj09", "JqZEX", "P4lDq", "WLw1J", "vlqE3",  # Form/Combobox/DatePicker/DateRangePicker/TimePicker/TagInput/Mention reusables
                    "BMOYE", "vuR8V", "RZOgR", "kDPmC", "iKAYe", "howAc", "Fhg5j",  # showcases (some also frames)
                    "oDq0f", "SOOaJ", "oOIRM",  # showcases for calendar/filterButton/sortButton
                ],
            ),
            (
                "organisms",
                [
                    "fileUploaderFrame",
                    "kNEYt",  # showcase/fileUploader
                ],
            ),
        ],
    },
    "display": {
        "scaffold_id": "displayRoot",
        "scaffold_name": "Display",
        "moves": [
            (
                "atoms",
                [
                    "badgeFrame", "separatorFrame", "avatarFrame",
                    "kbdFrame", "imgFrame", "toolPillFrame",
                    "AzeYS", "ooX6x", "RZgll",  # Skeleton variants top-level
                    "kRPqC", "lckl1",  # Code variants
                    "BkuMh",  # Spacer
                    "bIMqN",  # EmptyState
                    "G6IIC", "a0IaFK", "fA69N",  # Tag variants
                    "AzI7y",  # ColorSwatch
                    "Brd0E", "WFElW", "j0v7kp", "d1J0n", "QU8JC", "OmjeW",  # showcase frames for skeleton/code/spacer/emptyState/tag/colorSwatch
                ],
            ),
            (
                "molecules",
                [
                    "cardFrame", "accordionFrame", "listFrame",
                    "tableFrame", "carouselFrame",
                    "iW0nH", "V8lGC", "kfddR", "NEqXb", "z2h75",  # showcases card/list/accordion/table/carousel
                    "Cqduj", "YwLZD", "iJ9W7", "Y8NVeW", "ixfpr", "H0mVj", "b3kNf",  # dataTable/avatarGroup/codeBlock/timeline/treeView/markdownRenderer/statistic showcases (also used as frames)
                ],
            ),
        ],
    },
    "overlay": {
        "scaffold_id": "overlayRoot",
        "scaffold_name": "Overlay",
        "moves": [
            (
                "molecules",
                [
                    "dialogFrame", "modalFrame",
                    "sheetFrame", "popoverFrame",
                    "tooltipFrame", "hoverCardFrame", "dropdownMenuFrame",
                    "contextMenuFrame", "aiChatInputFrame", "aiChatMessageFrame",
                    "QWtBl",  # AlertDialog/Default
                    "rBuk5",  # Drawer/Default
                    "S6DGmk",  # showcase/alertDialog
                    "Dv13Y",  # showcase/drawer
                    "MrZib",  # showcase/dialog
                    "PWH9o",  # showcase/modal
                    "hI2RK",  # showcase/sheet
                    "pGDlW",  # showcase/popover
                    "emLjb",  # showcase/tooltip
                    "y59HU7",  # showcase/hoverCard
                    "W0TnW2",  # showcase/dropdownMenu
                    "NsO3c",  # showcase/contextMenu
                    "o30LfA",  # showcase/aiChatInput
                    "tf00c",  # showcase/aiChatMessage
                ],
            ),
            (
                "organisms",
                [
                    "shareModalFrame", "floatingPanelFrame",
                    "UfLlH",  # OnboardingFlow/Default
                    "bXrKb",  # showcase/floatingPanel
                    "UO7lY",  # showcase/shareModal
                    "s22VHM",  # showcase/onboardingFlow
                ],
            ),
        ],
    },
    "navigation": {
        "scaffold_id": "navigationRoot",
        "scaffold_name": "Navigation",
        "moves": [
            (
                "molecules",
                [
                    "breadcrumbFrame",
                    "tabsFrame",
                    "paginationFrame",
                    "menubarFrame",
                    "sidebarItemFrame",
                    "commandFrame",
                    "JDZtP",  # Sidebar/Default reusable
                    "ZabQJ",  # NavigationMenu/Default reusable
                    "u7U0Cs",  # showcase/breadcrumb
                    "ljQDI",  # showcase/tabs
                    "za0Mz",  # showcase/pagination
                    "s1ddo",  # showcase/menubar
                    "sSzWj",  # showcase/sidebarItem
                    "i37IRR",  # showcase/command
                    "V0XxoV",  # showcase/sidebar (also reusable container)
                    "aMzv9",  # showcase/navigationMenu (also reusable container)
                ],
            ),
            (
                "organisms",
                [
                    "appRailFrame",
                    "commandPaletteFrame",
                    "rightRailFrame",
                    "NUmsI",  # Header/Default
                    "rGzou",  # Footer/Default
                    "SV7A5",  # showcase/appRail
                    "N0A9Qo",  # showcase/commandPalette
                    "gHhOb",  # showcase/rightRail
                    "n0CoF",  # showcase/header (also frame)
                    "fXprq",  # showcase/footer (also frame)
                ],
            ),
        ],
    },
    "layout": {
        "scaffold_id": "layoutRoot",
        "scaffold_name": "Layout",
        "moves": [
            (
                "atoms",
                [
                    # Showcase + variant frames for atom-style layout components.
                    # Atoms layout has the showcase frame as the "variants
                    # container" — the reusables F3c0OQ etc. are top-level
                    # siblings referenced via ref.
                    "K5AUnC",  # showcase/aspectRatio
                    "y82psN",  # showcase/container
                    "Vwsvk",  # showcase/hStack
                    "sUUzz",  # showcase/vStack
                    "yQE7M",  # showcase/cluster
                    "BHOl8",  # showcase/grid
                    # Top-level reusables
                    "F3c0OQ",  # AspectRatio/16x9
                    "gq5Yc",  # AspectRatio/4x3
                    "u80qij",  # AspectRatio/1x1
                    "KeZXn",  # Container/Default
                    "sqVLI",  # HStack/Default
                    "LnZF5",  # VStack/Default
                    "j9GmcJ",  # Cluster/Default
                    "dejvF",  # Grid/Default
                ],
            ),
            (
                "molecules",
                [
                    "scrollAreaFrame",
                    "resizableFrame",
                    "D0QOt0",  # showcase/scrollArea
                    "UgVio",  # showcase/resizable
                ],
            ),
            (
                "organisms",
                [
                    "inspectorPanelFrame",
                    "spatialCanvasFrame",
                    "R2lWY",  # showcase/inspectorPanel
                    "i8FdM",  # showcase/spatialCanvas
                ],
            ),
        ],
    },
    "feedback": {
        "scaffold_id": "feedbackRoot",
        "scaffold_name": "Feedback",
        "moves": [
            ("atoms", ["alertFrame", "progressFrame", "spinnerFrame"]),
            (
                "molecules",
                [
                    "toastFrame",
                    "notificationCenterFrame",
                    "statusBarFrame",
                    "progressWidgetFrame",
                    "c9cpWh",
                    "MTvTn",
                    "SZumS",
                    "DDYIe",
                    "rf9Hs",
                    "x3pl4B",
                    "uhWh6",
                    "KIQHy",
                ],
            ),
            ("organisms", ["toastProviderFrame", "HM4RL"]),
        ],
    },
}


def find_and_remove(parent, target_id):
    if not isinstance(parent, dict):
        return None
    children = parent.get("children")
    if isinstance(children, list):
        for i, child in enumerate(children):
            if isinstance(child, dict) and child.get("id") == target_id:
                return children.pop(i)
        for child in children:
            found = find_and_remove(child, target_id)
            if found is not None:
                return found
    return None


def load_pen(name):
    path = DESIGN / f"{name}.pen"
    if path.stat().st_size == 0:
        return {"version": "2.7", "children": []}
    with open(path) as f:
        return json.load(f)


def save_pen(name, doc):
    path = DESIGN / f"{name}.pen"
    with open(path, "w") as f:
        json.dump(doc, f, indent=2)
        f.write("\n")


def ensure_target_root(target, scaffold_id, scaffold_name):
    children = target.setdefault("children", [])
    for c in children:
        if isinstance(c, dict) and c.get("id") == scaffold_id:
            return c
    root = {
        "type": "frame",
        "id": scaffold_id,
        "x": 0,
        "y": 0,
        "name": scaffold_name,
        "width": 1400,
        "fill": "#FFFFFF",
        "layout": "vertical",
        "gap": 32,
        "padding": 48,
        "children": [],
    }
    children.insert(0, root)
    return root


def main():
    if len(sys.argv) != 2:
        print("usage: migrate-pen-category.py <category>", file=sys.stderr)
        sys.exit(1)

    category = sys.argv[1]
    if category not in CATEGORY_MOVES:
        print(f"unknown category: {category}", file=sys.stderr)
        sys.exit(1)

    plan = CATEGORY_MOVES[category]
    pens = {}
    for source_name, _frames in plan["moves"]:
        if source_name not in pens:
            pens[source_name] = load_pen(source_name)
    pens[category] = load_pen(category)

    target_root = ensure_target_root(pens[category], plan["scaffold_id"], plan["scaffold_name"])

    moved = []
    missing = []
    for source_name, frame_ids in plan["moves"]:
        for fid in frame_ids:
            node = find_and_remove(pens[source_name], fid)
            if node is None:
                missing.append((source_name, fid))
            else:
                target_root["children"].append(node)
                moved.append((source_name, fid))

    if missing:
        print(f"\n  WARNING: {len(missing)} frames not found:")
        for source, fid in missing:
            print(f"    {source}.pen :: {fid}")
        sys.exit(1)

    for name, doc in pens.items():
        save_pen(name, doc)
        print(f"  wrote design/{name}.pen")

    print(f"\nMoved {len(moved)} frames into {category}.pen:")
    for source, fid in moved:
        print(f"  {fid}  (from {source}.pen)")


if __name__ == "__main__":
    main()
