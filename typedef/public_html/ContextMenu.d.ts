interface ContextMenuItemArgs<Context extends any> {
	label?: string,

	keepOpenAfterClick?: boolean,
	bold?: boolean,
	italic?: boolean,
	strikethrough?: boolean,
	underline?: boolean,

	textAlign?: string,
	color?: string,
	backgroundColor?: string,
	opacity?: string,
	fontSize?: string,
	padding?: string,

	attributes?: ContextMenuAttribute[],

	onShow?: ContextMenuItemCallback<Context>,
	onHover?: ContextMenuItemCallback<Context>,
	onClick?: ContextMenuItemCallback<Context>,
}

type ContextMenuAttribute = "keepOpenAfterClick" | "bold" | "italic" | "strikethrough" | "underline";

type ContextMenuItemCallback<Context> =
	(context: Context, item: HTMLDivElement, e: MouseEvent) => void;