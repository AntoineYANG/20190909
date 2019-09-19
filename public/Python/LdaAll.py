# -*- coding:utf-8 -*-
import sys
from gensim import corpora, models
import jieba.posseg as jp
import numpy as np
import random
import json


random.seed(11091987)

np.set_printoptions(threshold=np.inf)

# 分词过滤条件'
flags = ('n', 'nr', 'ns', 'nt', 'eng', 'v', 'd')  # 词性
stopwords = (
    '进一步', '做', '加大', '加强', '加快', '进行', '本市', '改造', '提升', '问题', '没有', '与', '了', '还', '被', '后', '苏', '皖', '我的', '车主', '对方',
    '请', '现场', '有', '已', '是', '时间', "尤其", "以", "电话", "吗", "能", "就", "建议", "让", "不", "都", "要", "太", "应该", "希望", "到", "最",
    "也", "应", "很", "更", "又", "来", "去", "再", "时", "问题", '杭州', '杭州市', '部门')  # 停词



if __name__ == '__main__':
    allText = []
    length = []
    for i in range(2016, 2019):
        # 导入文本集
        f = open("../public/data/origin$" + str(i) + "@" + sys.argv[1] + ".json",
                 encoding='utf8', errors='ignore')
        t = f.read()
        if t.startswith(u'\ufeff'):
            t = t.encode('utf8')[3:].decode('utf8')
        texts = json.loads(t)
        for w in texts:
            allText.append(w)
            pass
        length.append(len(texts))
        f.close()
        pass

    # 分词
    words_ls = []
    for text in allText:
        words = [w.word for w in jp.cut(text) if w.flag in flags and w.word not in stopwords]
        words_ls.append(words)

    # 构造词典
    dictionary = corpora.Dictionary(words_ls)
    # 基于词典，使【词】→【稀疏向量】，并将向量放入列表，形成【稀疏向量集】
    corpus = [dictionary.doc2bow(words) for words in words_ls]

    # lda模型，num_topics设置主题的个数
    lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=sys.argv[2],
                                   alpha=int(sys.argv[2])/50, eta=0.01, minimum_probability=0.001,
                                   iterations=200, passes=20)

    with open('../public/data/all${}@{}.json'.format(sys.argv[2], sys.argv[1]),
              mode="w", encoding="utf-8") as output:
        output.write('[')
        done = 0
        for year in length:
            output.write('[')
            for i in range(0, year):
                topic = lda.get_document_topics(corpus)[i]
                output.write("[")
                amended = []
                _sum = 0
                for e in topic:
                    _sum += e[1]
                    pass
                if int(sys.argv[2]) <= len(topic):
                    amended = [[x[0], x[1] / _sum] for x in topic]
                    pass
                else:
                    for stack in range(0, int(sys.argv[2])):
                        found = False
                        for datum in topic:
                            if int(datum[0]) == stack:
                                amended.append([datum[0], datum[1]])
                                found = True
                                break
                            pass
                        if not found:
                            amended.append([stack, (1 - _sum) / (int(sys.argv[2]) - len(topic))])
                            pass
                for idx in range(0, int(sys.argv[2])):
                    output.write(
                        '{"stack":' + "{}".format(amended[idx][0]) + ',"value":{}'.format(amended[idx][1]) + '}')
                    if idx != int(sys.argv[2]) - 1:
                        output.write(",")
                    pass
                if i != year - 1:
                    output.write("],\n")
                else:
                    output.write("]\n")
                pass
            done += year
            output.write(']')
            if year != length[len(length) - 1]:
                output.write(',')
                pass
            output.write('\n')
            pass
        output.write(']')
        pass
    pass
