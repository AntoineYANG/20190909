/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:02 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-10 12:02:46
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';

export interface CloudProps {}

export interface CloudState {
    words: Array<{text: string, value: number}>
}

export var CloudRefresh: () => void
    = () => void 0;

class Cloud extends Component<CloudProps, CloudState, any> {
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: CloudProps) {
        super(props);
        this.state = { words: [] };
    }

    public render(): JSX.Element {
        let maxvalue: number = 0;
        this.state.words.forEach(d => {
            if (d.value > maxvalue) {
                maxvalue = d.value;
            }
        });
        let words: Array<{text: string, value: number}> = this.state.words;
        words.sort((a, b) => {
            return a.value - b.value;
        });
        return (
            <svg width={420} height={230} id={'wordcloud'} xmlns={`http://www.w3.org/2000/svg`}>
                {
                    words.map((item, index) => {
                        let size: number = item.value / maxvalue * 20 + 20;
                        let width: number = 408 - size * item.text.length * 1.1;
                        let height: number = 218 - size * 1.3;
                        let _x: number = Math.random() * width + size * item.text.length * 0.55;
                        let _y: number = Math.random() * height + size * 0.65;
                        if (index !== 0 && Math.sqrt(Math.pow(_x - 210, 2) + Math.pow(_y - 115, 2)) < Math.sqrt(index) * 10) {
                            _x = _x < 210 ? _x - index * 100 : _x + index * 100;
                            _y = _y < 115 ? _y - index * 24 : _y + index * 24;
                        }
                        return (
                            <text key={index} className={'cloud_word'}
                                xmlns={`http://www.w3.org/2000/svg`}
                                x={ _x } y={ _y }
                                textAnchor={'middle'}
                                style={{
                                    fill: this.colortap[index % 20],
                                    fontSize: size
                                }}
                                >
                                { item.text }
                            </text>
                        )
                    })
                }
            </svg>
        );
    }

    public componentDidMount(): void {
        CloudRefresh = () => {
            this.setState({
                words: this.state.words
            });
        };
        
        this.setState({
            words: [
                { text: '关键词', value: 1024 },
                { text: '内容', value: 628 },
                { text: '主题', value: 800 },
                { text: '热词', value: 750 },
                { text: '干扰词', value: 500 },
                { text: '常用字', value: 800 },
                { text: '专有名词', value: 470 },
                { text: '细节', value: 10 },
                { text: '值得关注的内容', value: 640 },
                { text: '某个经常出现的字符串', value: 440 }
            ]
        });
    }
}


export default Cloud;