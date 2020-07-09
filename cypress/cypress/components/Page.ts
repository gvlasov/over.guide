export default abstract class Page {

    protected constructor(protected url: string) {

    }

    open() {
        cy.visit(this.url)
    }

}