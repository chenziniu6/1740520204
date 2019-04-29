/* 
    对于卡牌的数据输出


*/
const JOKER = 0;
const SPADE = 1;
const DIAMEND = 2;
const HEART = 3;
const CLUB = 4;

const BLACK_JOKER = 0;
const RED_JOKER = 1;

const TYPE_MAP = {
    0:'0',
    1:'1',
    2:'2',
    3:'3',
    4:'4'
}

const VALUE_MAP = {
    0:'0',
    1:'1',
    11:'11',
    12:'12',
    13:'13',
    14:'14'
}


class Card {
    constructor(type, value,cardid){
        this.type = type;
        this.value = value;
        this.cardid = cardid;
    }
    get type(){
        return this._type;
    }
    set type(t){
        if(t > 4 || t < 0)
        t = 0;
        else
        this._type = t;
    }
    get value(){
        return this._value;
    }
    set value(v){
        if(this.type === JOKER ){
            if (v < 0 || v > 1)
            this.value = 0;
            else
            this._value = v;

        }
        else {
            if(this.value > 14 || this.value < 2)
                this.value = 2;
            else
                this._value = v;
        }
    }
    get cardid(){
        return this._cardid;
    }
    set cardid(id){
        this._cardid=id;
    }
}
   

class CardGroup extends Array{
    /*
        return;
        5k,五同
        rs,皇家大顺
        sf,同花顺
        4k，4同
        fh，三带对
        fl，同花
        st，顺子
        3k，3同
        2p，2对
        1p,1对
        none:未中奖
    */
    judge(){
        /*
            1.拆分：一组为joker，一组为普通花色
            2.swith(joker.length),2,1,0
        */
       let is5k=false;//判断是否五同
       let isrs=false;
       let issf=false;
       let is4k=false;
       let isfh=false;
       let isfl=false;
       let isst=false;
       let is3k=false;
       let is2p=false;
       let is1p=false;
       let sfcardnum=new Array();//判断同花的顺子
       let cardnum=new Array();//判断顺子
       let rscolor=0;//判断颜色相同的牌数
       let likecard=new Array(5).fill(1);//判断相同值得数目
       const jokerArr=[],normalArr=[];
       for(const card of this){
           if(card.type==JOKER){
               jokerArr.push(card);
           }else{
               normalArr.push(card);
           }
       }
       //5k
       const w=normalArr[0].type;
       if(jokerArr.length>0)
       {
           const v=normalArr[0].value;
           for(const card of normalArr)
           {
               if(v===card.value||card.type===JOKER)
               {
                    is5k=true;
               }else{
                   is5k=false;
                   break;
               }
           }
           if(is5k)
           {
               return 'is5k';
           }else{//判断皇家大顺
               let rs9=0;//判断是否有JQK
               let rsA=0;
               let rscard=0;//判断9~A的牌数
               for(let card of normalArr)
                {
                    if(card.value===9)
                    {
                        rs9++;
                        rscard++;
                    }
                    if(card.value===10)
                    {
                        rscard++;
                    }
                    if(card.value===11)
                    {
                        rscard++;
                    }
                    if(card.value===12)
                    {
                        rscard++;
                    }
                    if(card.value===13)
                    {
                        rscard++;
                    }
                    if(card.value===14)
                    {
                        rsA++;
                        rscard++;
                    }
                    if(card.type===w)
                    {
                        rscolor++;
                    }
                }
                if(rscolor===normalArr.length){
                    if((rscard===4&&rsA===0)||(rscard===4&&rs9===0))
                    {
                        isrs=true;
                    }else if((rscard===3&&rsA===0)||(rscard===4&&rs9===0))
                    {
                        isrs=true;
                    }
                } 
           }
           if(isrs){//如果不是rs判断sf
            return 'isrs';
            }else{
                    for(let card of normalArr)
                    {
                        if(card.type===w)
                        {
                            sfcardnum.push(card.value);
                        }
                    }
                    if(sfcardnum.length===5-jokerArr.length)//判断除了王其他同色
                    {
                        sfcardnum = sfcardnum.sort();//排序
                        if(jokerArr.length===1)//如果有一张王
                        {
                            let l=1;//用王填数
                            for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                            {
                                if(sfcardnum[i]+1!=sfcardnum[i+1])
                                {
                                    if(sfcardnum[i+1]-sfcardnum[i]>=3){
                                        l=-1;
                                        break;
                                    }else if(sfcardnum[i+1]-sfcardnum[i]==2){
                                        l--;
                                    }
                                }
                            }
                            if(l>=0)//同花顺子
                            {
                                issf=true;
                            }else
                            {
                                issf=false;
                            } 
                        }else if(jokerArr.length===2)//如果有两张王
                        {
                            let l=2;//用王填数
                            for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                            {
                                if(sfcardnum[i]+1!=csfcardnum[i+1])
                                {
                                    if(sfcardnum[i+1]-sfcardnum[i]>=4){
                                        l=-1;
                                        break;
                                    }else if(sfcardnum[i+1]-sfcardnum[i]==2){
                                        l--;
                                    }else if(sfcardnum[i+1]-sfcardnum[i]==3){
                                        l=i-2;
                                    } 
                                }
                            }
                            if(l>=0)//是同花顺子
                            {
                                issf=true;
                            }
                        }
                    }
                }
            if(issf){
                return 'issf';
            }else{//判断四同
                for(let i=0;i<normalArr.length;i++)
                {
                    let j = i + 1;
                    let k = i;
                    while(k>=0&&j<normalArr.length)
                    {
                        if(normalArr[j].value===normalArr[k].value)
                        {
                            likecard[k]++;
                        }
                        k=k-1;
                    }
                }
                for(let i of likecard)
                {
                    if(i+jokerArr.length===4)
                    {
                        is4k=true;
                        break;
                    }
                }
            }
            if(is4k){
                return 'is4k';
            }else{//判断三带一对
                if(jokerArr.length===1){
                    let l = 0;//判断是否存在三对其他牌的一对
                    for(let i of likecard)
                    {
                        if(i===2){
                            l++;
                        }
                        if(l===2){
                            for(let i of likecard){
                                if(i+jokerArr.length===3)
                                {
                                    isfh=true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if(isfh){
                return 'isfh';
            }else{//判断同花
                if(sfcardnum.length+jokerArr.length===5){
                    isfl=true;
                }
            }
            if(isfl){
                return 'isfl';
            }else{
                for(let card of normalArr){
                    cardnum.push(card.value);
                }
                cardnum=cardnum.sort();
                if(jokerArr.length===1)//如果有一张王
                {
                    let l=1;//用王填数
                    for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                    {
                        if(cardnum[i]+1!==cardnum[i+1]&&cardnum[i]!==cardnum[i+1])
                        {
                            if(cardnum[i+1]-cardnum[i]>=3){
                                l=-1;
                                break;
                            }else if(cardnum[i+1]-cardnum[i]===2){
                                l--;
                                continue;
                            }
                        }else{
                            l=-1;
                            break;
                        }
                    }
                    if(l>=0)//顺子
                    {
                        isst=true;
                    }
                }else if(jokerArr.length===2)//如果有两张王
                {
                    let l=2;//用王填数
                    for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                    {
                        if(cardnum[i]+1!==cardnum[i+1]&&cardnum[i]!==cardnum[i+1])
                        {
                            if(cardnum[i+1]-cardnum[i]>=4){
                                l=-1;
                                break;
                            }else if(cardnum[i+1]-cardnum[i]==2){
                                l--;
                                continue;
                            }else if(cardnum[i+1]-cardnum[i]==3){
                                l=i-2;
                                continue;
                            } 
                        }else{
                            l=-1;
                            break;
                        }
                    }
                    if(l>=0)//是顺子
                    {
                        isst=true;
                    }
                }
            }
            if(isst){
                return 'isst';
            }else{//三同
                for(let i of likecard)
                {
                    if(i+jokerArr.length===3)
                    {
                        is3k=true;
                        break;
                    }
                }
            }
            if(is3k){
                return 'is3k';
            }else{//判断一对
                for(let i of likecard)
                {
                    if(i+jokerArr.length===2)
                    {
                        is1p=true;
                        break;
                    }
                }
            }
            if(is1p){
                return 'is1p';
            }else{
                return '未中奖';
            }
        }else{//没有王
            let rscard=0;//判断9~A的牌数
            let rs9=0;
            let rsA=0;
            for(let card of normalArr)//判断皇家大顺
            {
                if(card.value===9)
                {
                    rs9++;
                    rscard++;
                }
                if(card.value===10)
                {
                    rscard++;
                }
                if(card.value===11)
                {
                    rscard++;
                }
                if(card.value===12)
                {
                    rscard++;
                }
                if(card.value===13)
                {
                    rscard++;
                }
                if(card.value===14)
                {
                    rsA++;
                    rscard++;
                }
                if(card.type===w)
                {
                    rscolor++;
                }
            }
            if(rscolor===normalArr.length){
                if((rscard===5&&rsA===0)||(rscard===5&&rs9===0))
                {
                    isrs=true;
                }
            }
            if(isrs){
                return 'isrs';
            }else{//判断同花顺
                for(let card of normalArr)
                {
                    if(card.type===w)
                    {
                        sfcardnum.push(card.value);
                    }
                }
                for(let card of normalArr)
                {
                    cardnum.push(card.value);
                }
                if(sfcardnum.length===5)//判断5同色
                {
                    sfcardnum = sfcardnum.sort();//排序
                    for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                    {
                        if(sfcardnum[i]+1===sfcardnum[i+1])
                        {
                            issf=true;
                            continue;
                        }else{
                            issf=false;
                            break;
                        }
                    } 
                }
                if(issf){
                    return 'issf';
                }else{//判断4K
                    for(let i=0;i<normalArr.length;i++)
                    {
                        let j = i + 1;
                        let k = i;
                        while(k>=0&&j<normalArr.length)
                        {
                            if(normalArr[j].value===normalArr[k].value)
                            {
                                likecard[k]++;
                            }
                            k=k-1;
                        }
                    }
                    for(let i of likecard)
                    {
                        if(i===4)
                        {
                            is4k=true;
                            break;
                        }
                    }
                }
                if(is4k){
                    return 'is4k';
                }else{//三带对
                    let l3 = 0;//判断三个
                    let l = 0;//判断一对
                    for(let i of likecard)
                    {
                        if(i===2){
                            l++;
                        }
                        if(i===3){
                            l3++;
                        }
                        if(l3===1&&l===2){
                            isfh=true;
                        }
                    }
                }
                if(isfh){
                    return 'isfh';
                }else{//判断同花
                    if(sfcardnum.length===5){
                        isfl=true;
                    }
                }
                if(isfl){
                    return 'isfl';
                }else{//顺子
                    for(let card of normalArr){
                        cardnum.push(card.value);
                    }
                    cardnum=cardnum.sort();
                    for(let i=0;i<normalArr.length-1;i++)//判断是否为顺子,l为0即为顺子
                    {
                        if(cardnum[i]+1===cardnum[i+1])
                        {
                            isst=true;
                        }else{
                            isst=false;
                            break;
                        }
                    }
                }
                if(isst){
                    return 'isst';
                }else{
                    for(let i of likecard)
                    {
                        if(i===3)
                        {
                            is3k=true;
                            break;
                        }
                    }
                }
                if(is3k){
                    return 'is3k';
                }else{//2p
                    let l=0;//判断一对的对数
                    for(let i of likecard)
                    {
                        if(i===2)
                        {
                            l++;
                        }
                        if(l===2)
                        {
                            is2p=true;
                            break;
                        }
                    }
                }
                if(is2p){
                    return 'is2p';
                }else{
                    for(let i of likecard)
                    {
                        if(i===2)
                        {
                            is1p=true;
                            break;
                        }
                    }
                }
                if(is1p){
                    return 'is1p';
                }else{
                    return '继续努力';
                }
            }
        }
    }
}
const pokers = [];
let cardid = 2;
//pokers.push();
for(let i = 0; i < 5; i++)//将卡片推入数组
{
    if(i === JOKER)
    {
        pokers.push(new  Card(0,0,0))
        pokers.push(new  Card(0,1,1))
    }
    else{
        for(let j= 2; j < 15; j++)
        {
            pokers.push(new  Card(i,j,cardid));
            cardid++;
        }
    }
}

/*//向上取整
Math.ceil()

//向下取整
Math.floor()

//四舍五入
Math.round()
*/
//keep => [{type:1,value:1},{type:2,value:2}]
//origin => undefined or null,
//          [1,null,6,null,4,9]
let randomCards = (origin) =>{//keep为空随机获得五张卡，keep>0,随机-keep次
    if(!origin){//如果origin为空
        origin=new Array(5).fill(null);
    }
    const result = origin;

    for(let i=0; i<result.length; i++){
        let id = result[i];
        while(!id){
            id = Math.floor(Math.random()*54)
            if(result.includes(id)){
                id = null;
            }else {
                result[i] = id;
            }
        }
    }
    const resultobjects = new CardGroup;
    for (const i of result)
    {
        resultobjects.push(pokers[i]);
    }
    return resultobjects;
}

 module.exports = {
     pokers,
     randomCards,
     CardGroup
 }

