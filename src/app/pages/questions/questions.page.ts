import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../service/api.service';
import {ModalController, ToastController} from '@ionic/angular';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import * as moment from 'moment';
import {interval} from 'rxjs';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'app-questions',
    templateUrl: './questions.page.html',
    styleUrls: ['./questions.page.scss'],
})

export class QuestionsPage implements OnInit {
    private sub: any;
    lang: string;

    constructor(private modalController: ModalController, public quizService: ApiService,
                private screenOrientation: ScreenOrientation, private ngZone: NgZone,
                private toastController: ToastController, private router: Router,
                private translateServicce: TranslateService) {

    }

    @ViewChild('videoPlayer') videoplayer: ElementRef;
    @ViewChild('videoPlayerDemo') videoplayerDemo: ElementRef;

    public questiontypes = ["Hazard-Perception", 'Recognation', 'Risk-Responsibilty']; //'Reaction-SMC'
    // public questiontypes = [ 'Recognation', 'Risk-Responsibilty',"Hazard-Perception"]; //'Reaction-SMC'
    public questiontypesLegnth = this.questiontypes.length;
    public questiontypesCurrentLegnth = 0;
    saved = {
        Recognation: [], 'Risk-Responsibilty': [], 'Reaction-SMC': [], Hazard: [], 'Hazard-Perception': [],
    };
    entro: { msg: string, video?: string, img?: string, msgVideo?: any };
    entroEnabled = false;
    questionList: any;
    error: string;
    q_type: string;
    question: any;
    private legnth: number;
    private questionIndex = 0;
    selected: any = undefined;
    loading = false;
    private videoStarted: moment.Moment;
    private VideoClicked = [];

    /*
    * video
     */
    avantiDisabled = false;
    demoButton = false;
    videoStartButton = true;
    colorFooter = "primary"
    buttonFooter = "avanti";

    async ngOnInit() {
        this.getquestions(this.questiontypes[this.questiontypesCurrentLegnth]);
    }


    getquestions(q_type: any) {
        this.lang = this.translateServicce.getDefaultLang();
        console.log(this.lang);
        this.quizService.getquestions('questions', q_type, this.lang).subscribe((res: [any]) => {
            this.q_type = q_type;
            this.entroEnabled = false;
            switch (q_type) {
                case 'Recognation':

                    this.questionList = res.map(u => {
                        const array = [{answer: u.wrongans_1, correct: false}, {
                            answer: u.wrongans_2,
                            correct: false
                        }, {answer: u.wrongans_3, correct: false}, {answer: u.right_answer, correct: true}
                        ];
                        u.shuffled = this.shuffle(array);
                        return u;
                    });
                    this.legnth = res.length;
                    break;
                case 'Risk-Responsibilty':
                    this.questionList = res.map(u => {
                        const array = [{answer: u.wrongans_1, correct: false}, {
                            answer: u.wrongans_2,
                            correct: false
                        }, {answer: u.wrongans_3, correct: false}, {answer: u.right_answer, correct: true}
                        ];
                        u.shuffled = this.shuffle(array);
                        return u;
                    });
                    this.legnth = res.length;
                    break;
                case 'Hazard':
                    this.questionList = res;
                    this.legnth = res.length;
                    break;
                case 'Reaction-SMC':
                    this.questionList = res;
                    this.legnth = res.length;
                    break;
                case 'Hazard-Perception':
                    this.questionList = res;
                    this.legnth = res.length;
                    break;
                default:

                    break;
            }

            this.avanti(true);
            console.log(res);
        }, err => {
            console.log(err);
        });
    }


    async avanti(first?: boolean) {
        this.videoStartButton = true;
        if (first && this.legnth) {
            this.setIntro();

            this.question = this.questionList[0];
            this.questionIndex = 0;
            this.loading = false;
            return;
        }
        if (this.questiontypes[this.questiontypesCurrentLegnth] == "Hazard-Perception") {
            this.buttonFooter = "comincia";
            console.log("this.buttonFooter", this.buttonFooter)
        } else {
            this.buttonFooter = "avanti";
        }
        if (this.entroEnabled) {
            this.entroEnabled = false;
            return;
        }

        if (this.questionIndex < this.legnth - 1) {

            if (!this.selected && this.questiontypes[this.questiontypesCurrentLegnth] != "Hazard-Perception") {
                const toast = await this.toastController.create({
                    mode: 'md',
                    message: 'Si prega di selezionare una risposta',
                    color: 'danger',
                    position: 'top',
                    duration: 3000
                });
                toast.present();
                return;
            }
            this.saveResult();
            this.resetVars();
            this.questionIndex = this.questionIndex + 1;
            this.question = this.questionList[this.questionIndex];
            this.loading = false;
            return;
        } else {

            this.nextQuestionType();
        }

    }

    private nextQuestionType() {
        if (this.questiontypesCurrentLegnth < this.questiontypesLegnth) {

            this.questiontypesCurrentLegnth = this.questiontypesCurrentLegnth + 1;
            if (this.questiontypes[this.questiontypesCurrentLegnth] == "Hazard-Perception") {
                this.buttonFooter = "comincia";
                console.log("this.buttonFooter", this.buttonFooter)
            } else {
                this.buttonFooter = "avanti";
            }
            if (this.questiontypes[this.questiontypesCurrentLegnth] == undefined) {
                return this.sendResult();
            }
            this.ngOnInit();
        } else {
            this.sendResult();
        }

    }

    shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    checkLoaded(video: Event) {
        console.log(video);
    }

    checkEnded(video: Event) {
        this.buttonFooter = "avanti";
        this.colorFooter = "primary";
    }

    toggleVideo(event: any) {
        this.screenOrientation.onChange().subscribe(res => {
            console.log("cambiata orient");
            console.log(res);
        })
        console.log(this.screenOrientation.type);
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(value => {
            console.log(value);
        }).catch(err => console.log(err));

        console.log(event);
        this.videoStarted = moment();
        this.videoStartButton = false;
        this.buttonFooter = "pericolo";
        this.colorFooter = "danger";
        console.log(this.videoplayer);
        this.videoplayer.nativeElement.play().then(x => {
            console.log("video completed");

        });
        this.videoplayer.nativeElement.onfinish(res => {
            console.log("videoFinished", res);
        })

    }

    private saveResult() {
        switch (this.question.type) {
            case 'Recognation':
                console.log(this.selected);
                this.saved[this.question.type].push({
                    questionId: this.question.id,
                    question: this.question,
                    correct: this.selected
                });
                break;
            case 'Risk-Responsibilty':
                console.log(this.selected);
                this.saved[this.question.type].push({
                    questionId: this.question.id,
                    question: this.question,
                    correct: this.selected
                });
                break;

            case 'Hazard-Perception':
                console.log(this.selected);
                this.saved[this.question.type].push({
                    questionId: this.question.id,
                    question: this.question,
                    correct: this.question.pressed
                });
                break;
            default:
                break;
        }
        console.log(this.saved);

    }

    private resetVars() {
        this.selected = false;
    }

    SaveTimeVideo() {

        if (!this.question.pressed) {
            this.question.pressed = [];
        }
        const x = moment();
        this.question.pressed.push( moment(x.diff(this.videoStarted)).format('mm:ss'));
        console.log(this.videoStarted, this.question.pressed, moment(x.diff(this.videoStarted)).format('mm:ss'));
    }

    private setIntro() {
        this.ngZone.run(() => {
            switch (this.q_type) {
                case 'Recognation' :
                    this.entro = {
                        msg: 'Verranno mostrate delle immagini. Rispondi alla domanda indicando gli elementi dell\'immagine. È consentita una sola risposta\n.Dopo che hai risposto schiaccia AVANTI in basso a destra\n'
                    };
                    break;
                case 'Risk-Responsibilty' :
                    this.entro = {
                        msg: 'Leggere attentamente le seguenti domande e segna la risposta ritenuta corretta. I temi trattati sono la Velocità e la Responsabilità in caso di incidente.\n Successivamente verrà indicata la risposta corretta.\n Schiaccia Pronto per cominciare\n'
                    };
                    break;
                case 'Reaction-SMC' :
                    this.entro = {
                        msg: 'Verranno mostrate delle immagini. Rispondi alla domanda indicando gli elementi dell\'immagine. È consentita una sola risposta\n.Dopo che hai risposto schiaccia AVANTI in basso a destra\n'
                    };
                    break;
                case 'Hazard-Perception' :
                    this.entro = {
                        video: 'assets/demo.mp4',
                        msg: 'Ti verranno mostrati 4 video da un minuto ciascuno\n, l\'esercitazione richiede che tu riconosca le situazioni rischiose \n.che potrebbero avvenire improvvisamente\n' +
                            'Devi schiacciare il tasto RISCHIO ogni volta che ti sembrerà di rioconsocere una possibile situazione\n' +
                            'di rischio. Il numero di situazioni pericolose per video varia da 2 a 5 e quindi solo le prime 5 volte \n' +
                            'che schiaccerai il tasto saranno registrate. Guarda la demo per farti un\'idea di cosa ti sarà richiesto.\n',
                        msgVideo: [
                            {
                                sec: 1,
                                msg: 'Siamo fermi al semaforo rosso\n. I veicoli attraversano e improvvisamente appare il pedone,\n non è da considerare una situazione rischiosa\n. Non devi schaicciare il tasto RISCHIO\n'
                            },
                            {
                                sec: 23,
                                msg: 'Il semaforo è verde è ripartiamo\n.Improvvisamente un pedone attraversa la strada e non intende fermarsi o tornare indietro.\n Questa è una situazione che richiede il nostro intervento sui comandi \n Devi schiacciare il tasto RISCHIO il più velocemente possibile.\n'
                            },
                            {
                                sec: 33,
                                msg: 'Til semaforo è verde e ci stiamo muovendo.\n Ci sono pedoni ma per loro il semaforo è rosso.\n Non è considerata una situazione pericolosa\n Non devi schaicciare il tasto RISCHIO\n'
                            }, {
                                sec: 37,
                                msg: 'Clicca avanti per proseguire'
                            }]
                    };
                    this.avantiDisabled = true;
                    this.demoButton = true;
                    break;
            }
            console.log(this.entro, this.entroEnabled);
            this.entroEnabled = true;
        });
    }

    videoDemo() {
        this.videoplayerDemo.nativeElement.play();
        this.avantiDisabled = false;
        this.demoButton = false;
        this.sub = interval(1000)
            .subscribe((val) => {
                if (this.entro.msgVideo) {


                    const m = this.entro.msgVideo.find(x => x.sec == val);
                    if (m)
                        this.entro.msg = m.msg;
                }
            });

    }

    entroVideoEnd($event: Event) {
        this.avantiDisabled = false;
    }


    sendResult() {
        // this.saved = {prova  : {prova2: "value"}};
        /*   let answer : {} =
               {
                 "postId": 1,
                 "id": 1,
                 "name": "id labore ex et quam laborum",
                 "email": "Eliseo@gardner.biz",
                 "body": "laudantium enim quasi est quidnam sapiente accusantium"
               };
           console.log(answer); */

        const body = {
            user_id: parseInt(localStorage.getItem('user_id')),
            licens_id: parseInt(localStorage.getItem('licens_id')),
            answer: this.saved,
        };


        this.quizService.answers(body).subscribe(
            (data: any) => {
                this.router.navigate(['/thankyou']);
            });

    }

    selectlang(lang) {
        console.log(lang);
        localStorage.setItem('lang', lang);
        this.translateServicce.setDefaultLang(lang);
        this.translateServicce.resetLang(lang);

    }
}
