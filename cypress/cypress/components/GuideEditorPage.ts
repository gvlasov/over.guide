import Page from "./Page";

export default class SuggestPickPage extends Page {

    constructor() {
        super('/#/guide-editor');
    }

    locator = {
        get newVideoButtons() {
            return cy.get(`button.create-new-part-button[data-type='video']`)
        },
        get videoLinkInput() {
            return cy.get(`.guide-parts input.youtube-video-link-input`)
        },
        videoEditor(videoId: string) {
            return cy.get(`.video-editor iframe[id^=video-editor-${videoId}]`)
        },
        get youtubeVideoLinkErrors() {
            return cy.get(`.youtube-video-link-errors`)
        }
    }

    createNewVideoPart() {
        this.locator.newVideoButtons.first().click()
    }

    selectVideoByUrl(url: string) {
        this.locator.videoLinkInput.should('exist')
        this.locator.videoLinkInput.invoke('val', url).trigger('input');
    }

    seeValidationError(errorText: string) {
        this.locator.youtubeVideoLinkErrors.should('contain', errorText)
    }

    seeNoValidationError() {
        this.locator.youtubeVideoLinkErrors.children().should('have.length', 0)
    }

}