/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 13:36:37 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-19 12:21:35
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';
import { drawCloud } from './Cloud';


export interface ldaData {
    topics: Array<{topic: number, words: Array<{word: string, value: number}>}>;
    distributions: Array< Array<{stack: number, value: number}> >;
}

export interface DistributionProps {}

export interface DistributionState {
    data: Array<Array<Array<{stack: number, value: number}>>>;
}

export var importAsDistribution: (filedata: Array<Array<Array<{stack: number, value: number}>>>) => void
    = (filedata: Array<Array<Array<{stack: number, value: number}>>>) => void 0;

class Distribution extends Component<DistributionProps, DistributionState, any> {
    private bottom: number = 200;
    private top: number = 30;
    private left: number = 60;
    private right: number = 370;
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: DistributionProps) {
        super(props);
        this.state = {
            data: []
        };
    }

    public render(): JSX.Element {
        let topic: Array<Array<number>> = [];
        if (this.state.data.length === 0) {
            return (<></>);
        }
        let amount: number = this.state.data[0][0].length;
        for (let i: number = 0; i < amount; i++) {
            topic.push([]);
        }
        for (let year: number = 0; year < this.state.data.length; year++) {
            this.state.data[year].forEach(one => {
                one.forEach(d => {
                    topic[d.stack][year] = d.value;
                });
            });
        }
        let list: Array<number> = [];
        for (let i: number = 0; i < this.state.data.length; i++) {
            list.push(2016 + i);
        }
        return (
            <svg width={420} height={230} id={'distribution'} xmlns={`http://www.w3.org/2000/svg`}>
                <path d={`M${this.left},${this.bottom} L${this.left},${this.top}`} style={{stroke: 'black'}} />
                <path d={`M${this.left},${this.bottom} L${this.right},${this.bottom}`} style={{stroke: 'black'}} />
                {
                    list.map((item, index) => {
                        return (
                            <rect key={"back" + index}
                                x={this.left + index * ((this.right - this.left) / this.state.data.length)}
                                y={this.top}
                                width={((this.right - this.left) / this.state.data.length)}
                                height={this.bottom - this.top}
                                style={{
                                    fill: '#ccc'
                                }}
                                ref={"dom" + index}
                                onMouseOver={() => {
                                    $(this.refs["dom" + index]).css('fill', '#eee');
                                }}
                                onMouseOut={() => {
                                    $(this.refs["dom" + index]).css('fill', '#ccc');
                                }} />
                        )
                    })
                }
                {
                    topic.map((item, index) => {
                        return (
                            <path key={"polyline" + index}
                                d={(() => {
                                    let str: string = 'M';
                                    item.forEach((d, idx) => {
                                        if (idx === 0) {
                                            str += `${this.left + 0.5 * ((this.right - this.left) / this.state.data.length)},`;
                                            str += `${this.bottom - (this.bottom - this.top) * d}`;
                                        }
                                        else {
                                            str += ` L${this.left + (idx + 0.5) * ((this.right - this.left) / this.state.data.length)},`;
                                            str += `${this.bottom - (this.bottom - this.top) * d}`;
                                        }
                                    });
                                    return str;
                                })()}
                                onClick={() => {drawCloud(index + 1)}}
                                style={{
                                    stroke: this.colortap[index % this.colortap.length],
                                    strokeWidth: 2,
                                    fill: 'none'
                                }} />
                        )
                    })
                }
                {
                    list.map((item, index) => {
                        return (
                            <text key={"year" + index}
                                    x={this.left + (index + 0.5) * ((this.right - this.left) / this.state.data.length)}
                                    y={this.bottom + 15} textAnchor={'middle'} >
                                { item }
                            </text>
                        )
                    })
                }
            </svg>
        );
    }

    public import(filedata: Array<Array<Array<{stack: number, value: number}>>>): void {
        this.setState({
            data: filedata
        });
    }

    public componentDidMount(): void {
        importAsDistribution = this.import.bind(this);
    }
}


export default Distribution;
