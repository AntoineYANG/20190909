/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:15 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-19 11:03:45
 */
import React from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';
import Textbox, { setTextByPoint, importSentence } from './textbox';
// import Selector from './Selector';
import LdaSvg, { Source, setCor, CorData } from './LdaSvg';
import EmotionBar from './EmotionBar';
import Cloud, {CloudRefresh, loadCloud} from './Cloud';
import Distribution, { importAsDistribution } from './Distribution';
import axios, { AxiosResponse } from 'axios';
import ListBox from './ListBox';
import EmotionAll, { importAsEmotionAll } from './EmotionAll';


var clearStore: () => void
    = async () => {
        await axios.get(`/clear`)
                .then((value: AxiosResponse<any>) => {
                    console.log(value.data);
                }, (reason: any) => {
                    console.warn(reason);
                })
                .catch((reason: any) => {
                    console.warn(reason);
                });
    };

clearStore();

var active: () => void
    = () => {
        let year: number = parseInt($('#Year').val()!.toString()) + 2015;
        let source: Source = parseInt($('#project').val()!.toString()) === 1 ? Source.市教育局 : Source.市建委;
        if (isNaN(parseInt($('#etime').val()!.toString()))) {
            $('#etime').val('10');
        }
        let topic_amount: number = parseInt($('#etime').val()!.toString());
        run(year, source, topic_amount);
    };

export var run: (year: number, source: Source, topic_amount: number) => Promise<void>
    = async (year: number, source: Source, topic_amount: number) => {
        loadCloud({topics: [{topic: 0, words: []}], distributions: []});
        importAsDistribution([]);
        setCor({topics: [{topic: 0, words: []}], distributions: []}, {data: []}, [], source, topic_amount);
        importAsEmotionAll([]);
        await axios.get(`/run/${year}/${source === Source.市建委 ? 'sjw' : 'sjyj'}/${topic_amount}`, {
                    headers: 'Content-type:text/html;charset=utf-8'
                })
                .then((value: AxiosResponse<any>) => {
                    let data: string = value.data.toString().replace('\ufeff', '');
                    loadCloud(JSON.parse(data));
                    axios.get(`/tsne/${year}/${source === Source.市建委 ? 'sjw' : 'sjyj'}/${topic_amount}`, {
                            headers: 'Content-type:text/html;charset=utf-8'
                        })
                        .then((value: AxiosResponse<any>) => {
                            let tsnedata: CorData = {data: JSON.parse(value.data)};
                            let array: Array<any> = [];
                            axios.get(`/nlp/2016/${source === Source.市建委 ? 'sjw' : 'sjyj'}`, {
                                headers: 'Content-type:text/html;charset=utf-8'
                            })
                            .then((value: AxiosResponse<any>) => {
                                let part: Array<number> = [];
                                (JSON.parse(value.data)).forEach((e: string) => {
                                    part.push(parseFloat(e));
                                });
                                array.push(part);
                                axios.get(`/nlp/2017/${source === Source.市建委 ? 'sjw' : 'sjyj'}`, {
                                    headers: 'Content-type:text/html;charset=utf-8'
                                })
                                .then((value: AxiosResponse<any>) => {
                                    let part: Array<number> = [];
                                    (JSON.parse(value.data)).forEach((e: string) => {
                                        part.push(parseFloat(e));
                                    });
                                    array.push(part);
                                    axios.get(`/nlp/2018/${source === Source.市建委 ? 'sjw' : 'sjyj'}`, {
                                        headers: 'Content-type:text/html;charset=utf-8'
                                    })
                                    .then((value: AxiosResponse<any>) => {
                                        let part: Array<number> = [];
                                        (JSON.parse(value.data)).forEach((e: string) => {
                                            part.push(parseFloat(e));
                                        });
                                        array.push(part);
                                        importAsEmotionAll(array);
                                        setCor(JSON.parse(data), tsnedata, array[year - 2016], source, topic_amount);
                                        axios.get(`/all/${source === Source.市建委 ? 'sjw' : 'sjyj'}/${topic_amount}`, {
                                            headers: 'Content-type:text/html;charset=utf-8'
                                        })
                                        .then((value: AxiosResponse<any>) => {
                                            importAsDistribution(JSON.parse(value.data));
                                        }, (reason: any) => {
                                            console.warn(reason);
                                        })
                                        .catch((reason: any) => {
                                            console.warn(reason);
                                        });
                                    }, (reason: any) => {
                                        console.warn(reason);
                                    })
                                    .catch((reason: any) => {
                                        console.warn(reason);
                                    });
                                }, (reason: any) => {
                                    console.warn(reason);
                                })
                                .catch((reason: any) => {
                                    console.warn(reason);
                                });
                            }, (reason: any) => {
                                console.warn(reason);
                            })
                            .catch((reason: any) => {
                                console.warn(reason);
                            });
                        }, (reason: any) => {
                            console.warn(reason);
                        })
                        .catch((reason: any) => {
                            console.warn(reason);
                        });
                }, (reason: any) => {
                    console.warn(reason);
                })
                .catch((reason: any) => {
                    console.warn(reason);
                });
    };

    

const App: React.FC = () => {
    return (
        <>
        <div id="left">
            <div id="dataselect">
                <div className="panell-heading">
                    dataselect
                </div>
                <div >
                    <h1 style={{fontSize: '18px', marginLeft: '9px'}}>
                        相关建议的LDA结果与情感分析
                    </h1>
                </div>
                <div>
                    <select id="Year" style={{width: '80px', marginLeft: '10px', marginTop: '0px'}}>
                            <option value="1" id="year2016">2016</option>
                            <option value="2" id="year2017">2017</option>
                            <option value="3" id="year2018">2018</option>
                    </select>
                    <select id="project" style={{width: '100px', marginLeft: '10px', marginTop: '0px'}}>
                        <option value="1" id="1">市教育局</option>
                        <option value="2" id="2">市建委</option>
                    </select>
                    {/* <Selector id="area" marginTop='0px' />
                    <Selector id="cs" marginTop='10px' /> */}
                    <br />
                        &nbsp;&nbsp;&nbsp;Topic:
                        <input className="endTime" type="number" max='20' min='5' id='etime' placeholder='10'
                            style={{marginLeft: '9px', width: '100px', marginTop: '5px'}} />
                    <input type="button" value="TEST" id='btn' style={{width: '75px'}} onClick={active} />
                </div>
    
                <div id="sent"></div>
            </div>
            <div id="select">
                <div className="panell-heading">
                    Opinion1
                </div>
                <Textbox id='cloud' setText={setTextByPoint} />
            </div>
            <div id="list">
                <ListBox />
            </div>
            <div id="text">
                <div className="panell-heading">
                    Opinion2
                </div>
                <Textbox id='cloud2' setText={importSentence} />
            </div>
        </div>
    
        <div id="LDA">
            <div className="panell-heading">
                LDA
                <LdaSvg />
            </div>
        </div>
        <div id="emotion1">
            <div className="panell-heading">
                Emotion
            </div>
            <div id="Emo1" style={{height: '90px', width: '1259px'}}>
                <EmotionBar />
            </div>
        </div>
        <div id="topic">
            <div className="panell-heading">
                KeyWordCloud
            </div>
            <div id="cloud1" style={{height: '230px', width: '420px'}}>
                <button type="button" style={{position: 'relative', padding: '0px 5px', top: '-27px', left: '386px'}}
                        onClick={() => {CloudRefresh()}}>
                    R
                </button>
                <Cloud />
            </div>
        </div>
        <div id="emotion">
            <div className="panell-heading">
                All
            </div>
            <div id="Emo" style={{height: '230px', width: '420px'}}>
                <Distribution />
            </div>
        </div>
        <div id="extra">
            <div className="panell-heading">
                Extra
            </div>
            <div id="extraDiv" style={{height: '230px', width: '420px'}}>
                <EmotionAll />
            </div>
        </div>
        </>
    );
}
    
    export default App;
    