/// <reference types="cypress" />
import GuideEditorPage from "../components/GuideEditorPage";

context('guide-editor', () => {
    it('allows selecting youtube video by link', () => {
        const page = new GuideEditorPage();
        const videoId = 'scIugb-36-0';
        page.open()
        page.createNewVideoPart()
        page.selectVideoByUrl(`https://www.youtube.com/watch?v=${videoId}`)
        page.locator.videoEditor(videoId).should('be.visible')
    })
    it('validates youtube video link', () => {
        const page = new GuideEditorPage();
        page.open()
        page.createNewVideoPart()
        page.seeNoValidationError()
        page.selectVideoByUrl('a')
        page.seeValidationError('This is not a valid URL')
        page.selectVideoByUrl('https://google.com/')
        page.seeValidationError('This is not a valid Youtube video URL')
        page.selectVideoByUrl('https://www.youtube.com/watch?v=aaaa')
        page.seeValidationError('This video doesn\'t exist')
    })
})

