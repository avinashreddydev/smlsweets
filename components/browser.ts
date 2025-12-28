export function isMobileFirefox(): boolean | undefined {
    const userAgent = navigator.userAgent;
    return (
        typeof window !== 'undefined' &&
        ((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
            /FxiOS/.test(userAgent)) // iOS Firefox
    );
}

export function isMac(): boolean | undefined {
    return testPlatform(/^Mac/);
}

export function isIPhone(): boolean | undefined {
    return testPlatform(/^iPhone/);
}

export function isSafari(): boolean | undefined {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIPad(): boolean | undefined {
    return (
        testPlatform(/^iPad/) ||
        // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
        (isMac() && navigator.maxTouchPoints > 1)
    );
}

export function isIOS(): boolean | undefined {
    return isIPhone() || isIPad();
}

export function testPlatform(re: RegExp): boolean | undefined {
    return typeof window !== 'undefined' && window.navigator != null ? re.test(window.navigator.platform) : undefined;
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset',
]);

export function isInput(target: Element) {
    return (
        (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    );
}