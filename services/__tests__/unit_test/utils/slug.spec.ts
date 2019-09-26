import { slugify } from '../../../src/utils/slug';

describe('Slugify', () => {
    it('slugify_slug_slug', () => {
        expect(slugify('slug')).toBe('slug');
        expect(slugify('slug-ify')).toBe('slug-ify');
    });

    it('slugify_sentence_slug', () => {
        expect(slugify('This is a pretty nice sentence')).toBe('this-is-a-pretty-nice-sentence');
    });

    it('slugify_specialChar_slug', () => {
        expect(slugify('ãåăæąçć')).toBe('aaaaacc');
    });
});
