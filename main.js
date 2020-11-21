var config = {
    type: Phaser.AUTO,
    parent: 'jolasa',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var r1 = this.add.rectangle(200, 200, 148, 148, 0x6666ff);
    const helloButton = this.add.text(100, 100, 'Hello Phaser!', {
      fontSize: '36px',
      color: '#f00',
      fill: '#0f0'
    });
    helloButton.setInteractive();
        helloButton.on('pointerover', () => { console.log('pointerover'); });

    r1.setInteractive();
    r1.on('pointerover', () => {
      console.log("BBB");
    })

}
