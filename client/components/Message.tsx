import z from 'zod';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MessagePropsSchema = z.object({
	content: z.string(),
	sender: z.literal('user').or(z.literal('bot')),
	isLoading: z.boolean().default(false),
});

export type MessageProps = z.infer<typeof MessagePropsSchema>;

export const Message = ({ props }: { props: MessageProps }) => {
	return (
		<div
			className={`chat ${props.sender === 'user' ? 'chat-end' : 'chat-start'} p-2`}
		>
			{props.isLoading && (
				<span className='loading loading-dots loading-xs'></span>
			)}
			{!props.isLoading && (
				<div className='chat-bubble'>
					<Markdown className="prose dark:prose-red bg-neutral text-neutral-content" remarkPlugins={[[remarkGfm]]}>{props.content}</Markdown>
				</div>
			)}
		</div>
	);
};
