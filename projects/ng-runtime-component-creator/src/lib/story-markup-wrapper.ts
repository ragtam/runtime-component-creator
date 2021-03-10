export function storyMarkupWrapper(storyFunc: any): any {
    const story = storyFunc();

    return {
        ...story,
        template: `<div style="margin: 3em; border: 3px solid lightgrey; border-radius: 20px; padding: 2em">${story.template}</div>`,
    };
}
