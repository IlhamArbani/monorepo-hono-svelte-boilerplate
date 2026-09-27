<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { Link } from '@tiptap/extension-link';
	import { Image } from '@tiptap/extension-image';
	import { Table } from '@tiptap/extension-table';
	import { TableRow } from '@tiptap/extension-table-row';
	import { TableCell } from '@tiptap/extension-table-cell';
	import { TableHeader } from '@tiptap/extension-table-header';
	import { TaskList } from '@tiptap/extension-task-list';
	import { TaskItem } from '@tiptap/extension-task-item';
	import { TextAlign } from '@tiptap/extension-text-align';
	import { Placeholder } from '@tiptap/extension-placeholder';
	import { Underline } from '@tiptap/extension-underline';
	import { Highlight } from '@tiptap/extension-highlight';
	import { Subscript } from '@tiptap/extension-subscript';
	import { Superscript } from '@tiptap/extension-superscript';
	import { Youtube } from '@tiptap/extension-youtube';

	import {
		Bold, Italic, Code, Underline as UnderlineIcon, Strikethrough, Highlighter,
		Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Eraser,
		Undo, Redo, Quote, CodeXml, Minus, Image as ImageIcon, Link as LinkIcon, Video as YoutubeIcon,
		List, ListOrdered, ListCheck,
		AlignLeft, AlignCenter, AlignRight, AlignJustify,
		Table as TableIcon, Trash2, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, Rows4, Columns4
	} from 'lucide-svelte';

	let { value = $bindable(''), placeholder = 'Write something...' } = $props();

	let element = $state<HTMLElement | undefined>();
	let editor = $state<Editor | undefined>();
	let updateTrigger = $state(0); // Used to trigger reactivity on editor state changes

	onMount(() => {
		if (!element) return;
		editor = new Editor({
			element: element,
			content: value,
			extensions: [
				StarterKit.configure({
					heading: { levels: [1, 2, 3, 4, 5, 6] }
				}),
				Underline,
				Highlight,
				Subscript,
				Superscript,
				Link.configure({ openOnClick: false }),
				Image,
				Youtube,
				Table.configure({ resizable: true }),
				TableRow,
				TableHeader,
				TableCell,
				TaskList,
				TaskItem.configure({ nested: true }),
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				Placeholder.configure({ placeholder })
			],
			onTransaction: () => {
				// force reactivity to update toolbar buttons
				updateTrigger++;
			},
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			}
		});

		// Trigger initial reactivity
		updateTrigger++;
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// React to external value changes (only if it's different to avoid cursor jumping)
	$effect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value, { emitUpdate: false });
		}
	});

	function setLink() {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function addImage() {
		if (!editor) return;
		const url = window.prompt('Image URL');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}

	function addYoutube() {
		if (!editor) return;
		const url = window.prompt('YouTube Video URL');
		if (url) {
			editor.chain().focus().setYoutubeVideo({ src: url }).run();
		}
	}

	function createTable() {
		if (!editor) return;
		editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	}

	function btnClass(active: boolean = false) {
		return `inline-flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 ${active ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`;
	}
</script>

{#if editor && updateTrigger}
	<div class="flex flex-col rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
		<!-- Toolbar -->
		<div class="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900/50">
			<!-- Formatting -->
			<button type="button" onclick={() => editor?.chain().focus().toggleBold().run()} class={btnClass(editor.isActive('bold'))} title="Bold"><Bold size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleItalic().run()} class={btnClass(editor.isActive('italic'))} title="Italic"><Italic size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleCode().run()} class={btnClass(editor.isActive('code'))} title="Inline Code"><Code size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleUnderline().run()} class={btnClass(editor.isActive('underline'))} title="Underline"><UnderlineIcon size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleStrike().run()} class={btnClass(editor.isActive('strike'))} title="Strikethrough"><Strikethrough size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleHighlight().run()} class={btnClass(editor.isActive('highlight'))} title="Highlight"><Highlighter size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleSubscript().run()} class={btnClass(editor.isActive('subscript'))} title="Subscript"><SubscriptIcon size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleSuperscript().run()} class={btnClass(editor.isActive('superscript'))} title="Superscript"><SuperscriptIcon size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().unsetAllMarks().run()} class={btnClass()} title="Clear Formatting"><Eraser size={16} /></button>

			<div class="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-1"></div>

			<!-- History & Blocks -->
			<button type="button" onclick={() => editor?.chain().focus().undo().run()} disabled={!editor.can().undo()} class={btnClass()} title="Undo"><Undo size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().redo().run()} disabled={!editor.can().redo()} class={btnClass()} title="Redo"><Redo size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleBlockquote().run()} class={btnClass(editor.isActive('blockquote'))} title="Blockquote"><Quote size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleCodeBlock().run()} class={btnClass(editor.isActive('codeBlock'))} title="Code Block"><CodeXml size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().setHorizontalRule().run()} class={btnClass()} title="Horizontal Rule"><Minus size={16} /></button>
			
			<div class="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-1"></div>

			<!-- Media -->
			<button type="button" onclick={setLink} class={btnClass(editor.isActive('link'))} title="Link"><LinkIcon size={16} /></button>
			<button type="button" onclick={addImage} class={btnClass()} title="Image"><ImageIcon size={16} /></button>
			<button type="button" onclick={addYoutube} class={btnClass()} title="YouTube"><YoutubeIcon size={16} /></button>

			<div class="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-1"></div>

			<!-- Lists & Alignment -->
			<button type="button" onclick={() => editor?.chain().focus().toggleBulletList().run()} class={btnClass(editor.isActive('bulletList'))} title="Bullet List"><List size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleOrderedList().run()} class={btnClass(editor.isActive('orderedList'))} title="Ordered List"><ListOrdered size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().toggleTaskList().run()} class={btnClass(editor.isActive('taskList'))} title="Task List"><ListCheck size={16} /></button>

			<div class="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-1"></div>

			<button type="button" onclick={() => editor?.chain().focus().setTextAlign('left').run()} class={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().setTextAlign('center').run()} class={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().setTextAlign('right').run()} class={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight size={16} /></button>
			<button type="button" onclick={() => editor?.chain().focus().setTextAlign('justify').run()} class={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justify"><AlignJustify size={16} /></button>

			<div class="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-1"></div>

			<!-- Tables -->
			<button type="button" onclick={createTable} class={btnClass()} title="Insert Table"><TableIcon size={16} /></button>
			{#if editor.isActive('table')}
				<button type="button" onclick={() => editor?.chain().focus().addColumnBefore().run()} class={btnClass()} title="Add Column Before"><ArrowLeftFromLine size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().addColumnAfter().run()} class={btnClass()} title="Add Column After"><ArrowRightFromLine size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().deleteColumn().run()} class={btnClass()} title="Delete Column"><Columns4 size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().addRowBefore().run()} class={btnClass()} title="Add Row Before"><ArrowUpFromLine size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().addRowAfter().run()} class={btnClass()} title="Add Row After"><ArrowDownFromLine size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().deleteRow().run()} class={btnClass()} title="Delete Row"><Rows4 size={16} /></button>
				<button type="button" onclick={() => editor?.chain().focus().mergeCells().run()} class={btnClass()} title="Merge Cells">M</button>
				<button type="button" onclick={() => editor?.chain().focus().splitCell().run()} class={btnClass()} title="Split Cell">S</button>
				<button type="button" onclick={() => editor?.chain().focus().deleteTable().run()} class={btnClass()} title="Delete Table"><Trash2 size={16} /></button>
			{/if}
		</div>
	</div>
{/if}

<div bind:this={element} class="prose prose-sm max-w-none prose-neutral dark:prose-invert min-h-[300px] focus:outline-none {editor ? 'px-4 py-3 border-x border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-b-md shadow-sm' : ''}"></div>

<style>
	/* Tiptap overrides and specific styling for the editor container */
	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.tiptap table) {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		overflow: hidden;
	}

	:global(.tiptap table td),
	:global(.tiptap table th) {
		min-width: 1em;
		border: 1px solid #ced4da;
		padding: 3px 5px;
		vertical-align: top;
		box-sizing: border-box;
		position: relative;
	}

	:global(.dark .tiptap table td),
	:global(.dark .tiptap table th) {
		border-color: #374151;
	}

	:global(.tiptap table th) {
		font-weight: bold;
		text-align: left;
		background-color: #f1f3f5;
	}

	:global(.dark .tiptap table th) {
		background-color: #1f2937;
	}

	:global(.tiptap ul[data-type="taskList"]) {
		list-style: none;
		padding: 0;
	}

	:global(.tiptap ul[data-type="taskList"] p) {
		margin: 0;
	}

	:global(.tiptap ul[data-type="taskList"] li) {
		display: flex;
	}

	:global(.tiptap ul[data-type="taskList"] li > label) {
		flex: 0 0 auto;
		margin-right: 0.5rem;
		user-select: none;
	}

	:global(.tiptap ul[data-type="taskList"] li > div) {
		flex: 1 1 auto;
	}
	
	/* Hide default focus ring */
	:global(.tiptap:focus) {
		outline: none;
	}
</style>
