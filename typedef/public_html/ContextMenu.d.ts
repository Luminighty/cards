interface ContextMenuItemArgs<Context extends any> {
	label?: string,
	html?: string,

	keepOpenAfterClick?: boolean,
	bold?: boolean,
	italic?: boolean,
	strikethrough?: boolean,
	underline?: boolean,
	button?: boolean,

	textAlign?: string,
	color?: string,
	backgroundColor?: string,
	opacity?: string,
	fontSize?: string,
	padding?: string,

	attributes?: ContextMenuAttribute[],

	onShow?: ContextMenuItemCallback<Context>,
	onHover?: ContextMenuItemCallback<Context>,
	onHoverStop?: ContextMenuItemCallback<Context>,
	onClick?: ContextMenuItemCallback<Context>,
}

type ContextMenuAttribute = "keepOpenAfterClick" | "bold" | "italic" | "strikethrough" | "underline" | "button";

type ContextMenuItemCallback<Context> =
	(context: Context, item: HTMLDivElement, e: MouseEvent) => any;

type ContextSubMenuCallback<Context> =
	(menuConstructor: ContextMenu<Context>) => any