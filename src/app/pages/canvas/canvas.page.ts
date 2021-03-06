import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import * as moment from 'moment';
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.page.html',
    styleUrls: ['./canvas.page.scss'],
})
export class CanvasPage implements OnInit {

    private cx: CanvasRenderingContext2D;
    @ViewChild('myCanvas') canvas: any;
    @ViewChild('divCanv', {read: ElementRef}) divCanv: ElementRef;
    @ViewChild('header', {read: ElementRef}) header: ElementRef;
    @ViewChild('footer', {read: ElementRef}) footer: ElementRef;
    canvasElement: any;
    lastX: number;
    lastY: number;
    private image: HTMLImageElement;
    private totalWidth: number;
    private totalHeight: number;
    private audio: HTMLAudioElement;
    private headerHeight: any;
    private footerHeight: number;
    entroEnabled: any = true;
    attemp = 0;
    buttonFooter = "avanti";
    private result: any[] = [];

    constructor(private renderer: Renderer2,
                private platform: Platform,
                private nativeAudio: NativeAudio,
                private quizService: ApiService,
                private router: Router,
                private translateService: TranslateService
    ) {

    }

    ngOnInit() {

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
            const rand: number = this.getRandom(5000, 2000);
            let intervalId = setInterval(() => {
                const ranx = this.getRandom(this.totalWidth - 20, 20);
                const rany = this.getRandom(this.totalHeight - 20, 20);
                this.result[this.attemp] = {};
                this.result[this.attemp].startTime = moment();
                this.loadImageOnCanvas(ranx, rany)
                setTimeout(() => {
                    this.attemp = this.attemp + 1;
                    clearInterval(intervalId);
                    this.initSample();
                }, 1000)

            }, rand)

        } else {
            this.buttonFooter = 'avanti';
        }

    }


    getRandom(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    loadImageOnCanvas(pozx, pozy) {
        console.log("----loadImageOnCanvas----")
        this.image = new Image();
        this.image.onload = () => {
            this.cx.drawImage(this.image, pozx, pozy, 40, 40);
            // this.audio.play();
            //  this.audio.play();
        }
        this.image.onloadeddata = () => {

        }
        this.image.src = "https://www.freeiconspng.com/uploads/glossy-ball-color-icon-26.jpg";
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
            this.sendResult()
        }
    }

    sendResult() {

        const body = {
            user_id: parseInt(localStorage.getItem('user_id')),
            licens_id: parseInt(localStorage.getItem('licens_id')),
            answer: {"Reaction-simple": this.result},
        };



          this.quizService.updateanswers(body).subscribe(
              (data: any) => {
                  this.router.navigate(['/canvas2']);
              });

    }

    addResult() {
        const m = moment();
        if (this.result[this.attemp])
            this.result[this.attemp].result = moment(m.diff(this.result[this.attemp].startTime)).format("mm:ss.SSS")
        console.log(this.result);
    }
}
