### CSS
#### 防止高度坍塌的四种方案
1. 为父元素设置overflow:hidden属性
   * 原理： CSS中的overflow:hidden属性会强制要求父元素必须包裹住内部所有的浮动元素，以及所有元素的margin范围
   * 缺点：如果刚好父元素的有些超范围的子元素内人口需要显示，不想隐藏，就会发生冲突
2. 在父元素内的结尾追加一个空子元素(块级元素)，并设置空子元素清除浮动影响(clear:both)
   * 原理：利用clear: both属性和父元素必须包含非浮动的元素两个原理
   * 缺点：无端多出一个无意义的看不见的空元素，影响选择器和查找元素
3. 设置父元素也浮动
   * 原理：浮动元素也会强制父元素扩大到包含所有浮动的内部元素
   * 缺点：产生新的浮动影响。比如，父元素浮动，导致父元素之后平级的页脚div上移，被父元素挡住
   * 解决：设置父元素之后的平级元素清除浮动(clear: both)
4. 为父元素末尾伪元素设置clear: both
   * 优点：既不会影响显示隐藏，又不会影响查找元素，不会产生新的浮动问题
   * `父元素::after{content: "";display: table; clear: both;}`
   * 问题：个别浏览器display: table，可能默认带高度
   * 解决：加一个属性`height: 0px;`

#### 什么是BFC(block formatting context)
* 网页中一个独立的渲染区域
* 这个渲染区域只有块级元素能够参与
* 规定了内部的块级元素如何布局，与外部毫无关系

##### 布局规则
* 默认，内部的块级元素会在垂直方向，一个接一个放置。每个块级元素独占一行
* 块级元素垂直方向的总距离有边框大小+margin共同决定
* 属于同一个BFC的两个相连块级元素在垂直方向上的margin会发生重叠/合并。水平方向上的不会，而是相接
* 计算父元素BFC渲染区域的高度时，内部浮动元素的高度，必须计算在内

##### 四种情况会形成BFC渲染区域
1. float的值不是none
2. position的值不是static或者relative
3. display的值时inline-block、table-cell、flex、table-caption或者inline-flex
4. overflow的值不是visible

#### 什么是IFC(inline formatting context)
* 行级元素格式上下文

#### 避免垂直方向上的margin合并
* 垂直方向上的两个元素上下margin相遇时，两元素之间的总间距不等于两个margin的和，等于最大的margin
* 解决：用一个外围元素包裹下方元素，设置新外层元素overflow: hidden
* 原理：新外层元素，变成一个BFC方式渲染区域，必须包裹住内部子元素及子元素的margin
* 缺点：如果父元素中部分自由定位的子元素，希望超出父元素范围，也能显示，冲突
* 第二步：父元素::before{content: "";display: table;}
* 原理：display:table，在子元素之前形成平级的BFC区域。不允许子元素的margin进入::before范围
* 优点：不隐藏内容，步添加新的元素，不影响高度

#### 避免垂直方向margin溢出
##### 问题
* 子元素设置margin-top，会超出父元素上边的范围，变成父元素的margin-top

##### 五种解决办法
1. 设置父元素的overflow: hidden
    * 原理： 父元素变成BFC渲染区域，必须包裹内层子元素的margin
    * 缺点：有的子元素，即使溢父元素，也希望显示则冲突

2. 为父元素添加上边框，颜色设置为透明(transparent)
   * 原理：不是BFC，边框本身可以阻止margin溢出
   * 缺点：边框会增加父元素的实际大小，导致布局错乱
3. 为父元素的padding-top代替第一个子元素的margin-top
   * 原理:这里也不是BFC，而是因为padding本身可以阻隔margin溢出
4. 在父元素内第一个子元素之前添加一个空的<table></table> 
    * 原理：table的display属性默认相当于table，形成了小的BFC渲染区域。其他元素margin不能进入table范围。
    * 优点：空table元素没有大小，不占用父元素控件
    * 缺点：增加一个看不见的空元素，干扰查找元素
5. 最好的解决方式
   * 父元素::before{content:"";display:table;}
   * 优点：既不隐藏内容，又不添加新元素，不影响高度

#### 左定宽，右自适应
1. 左边定宽，左浮动。右边右浮动
2. 最优：左边左浮动定宽。右边元素overflow: hidden

#### 弹性布局
* flex-dircation
* flex-warp
* justify-content
* flex-shrink
* flex-grow
* align-item
* align-self

#### 水平居中方案总结
##### 场景一
* 子元素是块级元素且宽度没有设定
* 子元素会占据父元素的宽度，不存在水平居中说法

##### 场景二
* 子元素是行内元素，子元素的宽度是有内容撑开
* 解决：text-align: center

##### 场景三
* 子元素是块级元素且宽度已设定
  * 方案一：给子元素添加margin: 0 auto;
  * 方案二：通过计算指定父元素的padding-left/padding-right或margin-left/margin-right
  * 方案三：子绝父相
  * 方案四：弹性布局

#### 垂直居中方案
##### 场景一
* 子元素是行内元素，高度是由内容撑开
* 单行：设定父元素的line-height使得子元素垂直居中
* 多行：设定父元素display:inline/inline-block/table-cell;vertical-align:middle解决

##### 场景二
* 子元素是块级元素但高度没有设定
* 方案一：通过给父元素设定display:inline/inline-block/table-cell;vertical-align:center;
* 方案二：父元素flex布局

##### 场景三
* 子元素是块级元素高度已设定
  * 方案一：
    * 计算子元素的margin-top/margin-bottom或padding-top/padding-bottm
    * 给父元素和子元素设定box-sizing: border-box
    * (父高 - 子高)/2
  * 方案二：利用子绝父相
  * 方案三：flex布局

#### 水平垂直居中
* 子绝父相

#### CSS选择器优先级

* !import：1000
* 内联样式： 1000
* id选择器： 0100
* 类选择器 /属性选择器/伪类选择器 0010
* 元素选择器/伪元素选择器 0001
* 关系选择器/通配符选择器  0000