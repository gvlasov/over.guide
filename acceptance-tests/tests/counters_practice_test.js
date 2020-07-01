Feature('counters practice');

Scenario('shows ads placeholder', (I) => {
    I.amOnPage('/')
    I.see('AdSense')
});
