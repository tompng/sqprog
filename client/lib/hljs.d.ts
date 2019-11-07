declare namespace hljs
{
	export function highlight(name: string, value: string) : {
		language: string;
		value: string;
	}
}
export = hljs;
export as namespace hljs;
