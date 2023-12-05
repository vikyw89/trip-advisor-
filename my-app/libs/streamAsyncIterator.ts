export async function* streamAsyncIterator(stream: ReadableStream<any>) {
	// Get a lock on the stream
	const reader = stream.getReader()
	try {
		while (true) {
			// Read from the stream
			const { done, value } = await reader.read();
			// Exit if we're done
			if (done) return;
			// Else yield the chunk
			yield value;
		}
	} finally {
		reader.releaseLock()
	}
}

export async function* jsonStreamIterator(stream: ReadableStream<any>) {
	const utf8Decoder = new TextDecoder("utf-8");
	let reader = stream.getReader()
	try{
		let { value: chunk, done: readerDone } = await reader.read();
		chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";
	  
		let re = /\r\n|\n|\r/gm;
		let startIndex = 0;
	  
		for (;;) {
		  let result = re.exec(chunk);
		  if (!result) {
			if (readerDone) {
			  break;
			}
			let remainder = chunk.substr(startIndex);
			({ value: chunk, done: readerDone } = await reader.read());
			chunk =
			  remainder + (chunk ? utf8Decoder.decode(chunk, { stream: true }) : "");
			startIndex = re.lastIndex = 0;
			continue;
		  }
		  yield await JSON.parse(chunk.substring(startIndex, result.index))
		  startIndex = re.lastIndex;
		}
		if (startIndex < chunk.length) {
		  // last line didn't end in a newline char
		  yield await JSON.parse(chunk.substr(startIndex))
		}
	} finally {
		reader.releaseLock()
	}
  }