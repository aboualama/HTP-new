import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import * as moment from "moment";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-canvas2',
    templateUrl: './canvas2.page.html',
    styleUrls: ['./canvas2.page.scss'],
})
export class Canvas2Page implements OnInit {

    private icons = ['assets/icons/ellipse-red.svg', "assets/icons/ellipse-yellow.svg", "assets/icons/ellipse-green.svg"]
    private cx: CanvasRenderingContext2D;
    @ViewChild('myCanvas') canvas: any;
    @ViewChild('divCanv', {read: ElementRef}) divCanv: ElementRef;
    @ViewChild('header', {read: ElementRef}) header: ElementRef;
    @ViewChild('footer', {read: ElementRef}) footer: ElementRef;
    canvasElement: any;
    lastX: number;
    lastY: number;
    private image: HTMLOrSVGImageElement;
    private totalWidth: number;
    private totalHeight: number;
    private audio: HTMLAudioElement;
    private headerHeight: any;
    private footerHeight: number;
    entroEnabled: any = true;
    attemp = 0;
    buttonFooter = "avanti";
    private result = {correct: [], wrong: 0};

    private randomAudio: number;
    private randomImage: number;

    constructor(private renderer: Renderer2,
                private platform: Platform,
                private nativeAudio: NativeAudio,
                private quizService: ApiService,
                private router: Router
    ) {

    }

    ngOnInit() {
        this.initAudio();
    }

    initAudio() {
        this.nativeAudio.preloadSimple("1", "audio/beep-01a.mp3")
        this.audio = new Audio("assets/audio/beep-01a.mp3");
    }

    playAudio() {
        // this.audio.play();
        //   this.nativeAudio.play("1");
    }

    ngAfterViewInit() {


    }

    initCanvas() {
        this.canvasElement = this.canvas.nativeElement;
        console.log(this.canvasElement);
        //     this.totalWidth = this.platform.width();
        //    this.totalHeight = this.platform.width();

        setTimeout(() => {
            //  this.headerHeight = this.header.nativeElement.offsetHeight;
            //     this.footerHeight = this.footer.nativeElement.offsetHeight;
            this.cx = this.canvasElement.getContext('2d')!;
            this.cx.lineWidth = 1;

            this.totalWidth = this.divCanv.nativeElement.offsetWidth;
            this.totalHeight = this.divCanv.nativeElement.offsetHeight;
            console.log(this.totalHeight, this.totalWidth);
            this.renderer.setAttribute(this.canvasElement, 'width', this.totalWidth + '');
            this.renderer.setAttribute(this.canvasElement, 'height', this.totalHeight + '');
        }, 0);
        this.initSample();
    }

    initSample() {
        if (this.attemp < 5) {
            const rand: number = this.getRandom(2500, 1500);
            let intervalId = setInterval(() => {
                const ranx = this.getRandom(this.totalWidth - 40, 20);
                const rany = this.getRandom(this.totalHeight - 40, 20);
                this.result["correct"][this.attemp] = {};
                this.result["correct"][this.attemp].startTime = moment();
                this.randomImage = this.getRandom(2, 0);
                this.randomAudio = this.getRandom(1, 0);
                this.loadImageOnCanvas(ranx, rany, this.icons[this.randomImage], this.randomAudio)
                setTimeout(() => {
                    if (this.randomImage == 0 && this.randomAudio == 1)
                        this.attemp = this.attemp + 1;
                    clearInterval(intervalId);
                    this.initSample();
                }, 1000)

            }, rand)

        } else {
            let intervalId = setInterval(null, 1000);
            this.buttonFooter = 'avanti';
        }

    }


    getRandom(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    loadImageOnCanvas(pozx, pozy, src = "assets/icons/ellipse.svg", audio?) {
        console.log("----loadImageOnCanvas----")
        this.image = new Image();
        this.image.onload = () => {
            this.cx.drawImage(this.image, pozx, pozy, 40, 40);
            if (audio > 0)
                this.audio.play();
            //  this.audio.play();
        }
        this.image.onloadeddata = () => {

        }
        this.image.src = src;
        this.image.style.color = "red";
        this.image.style.background = "red";
        this.image.height = 40;
        this.image.width = 40;
        setTimeout(() => {
            // this.nativeAudio.play("1");
            //    this.audio.play();
            this.cx.clearRect(pozx, pozy, 40, 40);
        }, 1000)
    }

    handleStart(ev) {
        console.log("----handleStart----")
        this.lastX = ev.touches[0].pageX;
        this.lastY = ev.touches[0].pageY;
    }

    handleMove($event: TouchEvent) {

    }

    registra() {

    }

    async avanti(first?: boolean) {

        if (this.entroEnabled) {
            this.entroEnabled = false;
            this.buttonFooter = "danger";
            this.initCanvas();
            return;
        } else {
            this.sendResult();
        }
    }

    addResult() {
        const m = moment();
        if (this.randomImage == 0 && this.randomAudio == 1)
            this.result['correct'][this.attemp].result = moment(m.diff(this.result["correct"][this.attemp].startTime)).format("mm:ss.SSS")
        else
            this.result.wrong = this.result.wrong + 1;
        console.log(this.result);
    }

    sendResult() {

        const body = {
            user_id: parseInt(localStorage.getItem('user_id')),
            licens_id: parseInt(localStorage.getItem('licens_id')),
            answer: {"Reaction-complex": this.result},

        };
        this.quizService.updateanswers(body).subscribe(
            (data: any) => {
                this.router.navigate(['/questions/5']);
            });
    }

}
