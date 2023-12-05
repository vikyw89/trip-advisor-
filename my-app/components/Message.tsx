import z from 'zod';

export const MessagePropsSchema = z.object({
	content: z.string(),
	sender: z.literal('user').or(z.literal('bot')),
	isLoading: z.boolean().default(false),
});

export type MessageProps = z.infer<typeof MessagePropsSchema>;

export const Message = ({ props }: { props: MessageProps }) => {
	return (
		<div
			className={`chat ${props.sender === 'user' ? 'chat-end' : 'chat-start'}`}
		>
			{props.isLoading && (
				<span className='loading loading-dots loading-xs'></span>
			)}
			{!props.isLoading && <div className='chat-bubble'>{props.content}</div>}
		</div>
	);
};
