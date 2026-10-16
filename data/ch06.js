(function () {
  const E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const I = s => `<code>${E(s)}</code>`;
  // «…» 로 감싼 부분은 PPT에서 진한 글씨였던 곳
  const C = s => `<pre><code>${E(s.trim()).replace(/«(.*?)»/g, '<b class="pb">$1</b>')}</code></pre>`;
  const P = '{{PROF}}';
  const methods = rows => `<table class="m"><tr><th>메소드</th><th>설명</th></tr>${rows.map(([m, d, prof]) =>
    `<tr class="${prof ? 'hl' : ''}"><td>${I(m)}</td><td>${E(d)} ${prof ? P : ''}</td></tr>`).join('')}</table>`;

  const sections = [
    {
      id: 'range', title: '0. 6장 시험 범위 (녹음 안내)', open: true,
      html: `
        <ul>
          <li><b>30페이지부터</b> 출제. 앞부분(패키지, 모듈)은 안 냄</li>
          <li>꼭 낸다: <b>toString(), equals()</b> 오버라이딩 (예제 6-3 굵은 글씨) ${P}</li>
          <li>Wrapper에서 <b>parseInt</b> 같은 변환 메소드, <b>박싱/언박싱</b> 개념 ${P}</li>
          <li><b>String 주요 메소드</b>(52페이지), <b>StringTokenizer</b>(예제 6-7) ${P}</li>
          <li class="maybe">StringBuffer, Math: "낼 수도 있고 안 낼 수도"</li>
        </ul>
        <p class="legend">코드 속 <b class="pb">주황 굵은 글씨</b> = PPT에서 진한 글씨였던 부분. 코드 빈칸 문제도 이 부분을 뚫었습니다.</p>`,
    },
    {
      id: 'pkg', title: '1. JDK의 주요 패키지 (30쪽)',
      html: `
        <ul>
          <li>${I('java.lang')}: 스트링, 수학 함수, 입출력 등 기본 클래스. <b>자동으로 import 됨</b>(import 문 필요 없음)</li>
          <li>${I('java.util')}: 날짜, 시간, 벡터, 해시맵 같은 유틸리티 클래스</li>
          <li>${I('java.io')}: 키보드, 모니터, 프린터, 디스크 입출력</li>
          <li>${I('java.awt')}: GUI용 AWT 패키지 / ${I('javax.swing')}: GUI용 스윙 패키지</li>
        </ul>
        <div class="tip">StringTokenizer는 ${I('java.util')}에 있어서 ${I('import java.util.StringTokenizer;')}가 필요합니다. String, Object, Math, Wrapper는 java.lang이라 import가 필요 없습니다.</div>`,
    },
    {
      id: 'object', title: '2. Object 클래스 (31~33쪽)',
      html: `
        <ul>
          <li>모든 자바 클래스는 반드시 Object를 상속받도록 <b>자동 컴파일</b>됨</li>
          <li><b>최상위 클래스</b>, 모든 클래스의 수퍼 클래스, ${I('java.lang')} 패키지</li>
        </ul>
        ${methods([
          ['boolean equals(Object obj)', 'obj가 가리키는 객체와 현재 객체를 비교하여 같으면 true', true],
          ['Class getClass()', '현 객체의 런타임 클래스를 리턴'],
          ['int hashCode()', '현 객체에 대한 해시 코드 값 리턴'],
          ['String toString()', '현 객체에 대한 문자열 표현을 리턴', true],
          ['void notify() / notifyAll() / wait()', '스레드 관련 (대기 스레드 깨우기, 대기)'],
        ])}
        <h4>예제 6-1 객체 속성 알아내기</h4>
        ${C(`
Point p = new Point(2,3);
System.out.println(«p.getClass()».getName()); // Point      (클래스 이름)
System.out.println(«p.hashCode()»);           // 22279806   (해시 코드, 실행마다 다름)
System.out.println(«p.toString()»);           // Point@153f67e`)}
        <div class="tip">녹음: "hashCode, getClass 이런 거 안 중요해요. <b>toString이랑 equals</b>가 너무 중요해."</div>`,
    },
    {
      id: 'tostring', title: '3. toString(): 객체를 문자열로 (34~35쪽)', prof: true,
      html: `
        <ul>
          <li>Object의 기본 toString()은 <b>클래스명@해시코드값</b> (예: ${I('Point@15db9742')})</li>
          <li>클래스를 만들 때 ${I('public String toString()')}을 <b>오버라이딩</b>해서 자기만의 문자열을 리턴</li>
          <li><b>자동 변환</b>: ${I('객체 + 문자열')} → ${I('객체.toString() + 문자열')}, 객체를 단독으로 출력해도 ${I('객체.toString()')}</li>
        </ul>
        <h4>예제 6-2 Point 클래스에 toString() 작성</h4>
        ${C(`
class Point {
    private int x, y;
    public Point(int x, int y) {
        this.x = x; this.y = y;
    }
    «public String toString() {»
        «return "Point(" + x + "," + y + ")";»
    «}»
}
public class ToStringEx {
    public static void main(String [] args) {
        Point a = new Point(2,3);
        System.out.println(«a.toString()»); // Point(2,3)
        System.out.println(«a»);            // Point(2,3)  ← a.toString() 자동 호출
        System.out.println(a + " 입니다."); // Point(2,3) 입니다.
    }
}`)}
        <div class="trap">함정: 리턴 타입은 ${I('String')}, 접근 지정자는 ${I('public')}입니다. Object의 public 메소드를 오버라이딩하므로 public을 빼면 컴파일 오류입니다.</div>`,
    },
    {
      id: 'equals', title: '4. == 와 equals() (36~40쪽)', prof: true,
      html: `
        <ul>
          <li>${I('==')} 연산자: <b>객체 레퍼런스 비교</b> (같은 객체를 가리키는가)</li>
          <li>${I('boolean equals(Object obj)')}: <b>두 객체의 내용물 비교</b>. 클래스 작성자가 오버라이딩해야 함</li>
          <li>String 클래스는 equals()를 이미 오버라이딩해 두었음</li>
        </ul>
        ${C(`
Point a = new Point(2,3);
Point b = new Point(2,3);
Point c = a;
if(«a == b») System.out.println("a==b");   // false → 출력 안 됨
if(«a == c») System.out.println("a==c");   // true  → a==c`)}
        <h4>예제 6-3 Point 클래스의 equals() 작성 ${P}</h4>
        <p>메모에 적은 "6-3 예제 <b>bold</b>"는 아래 주황 굵은 부분(equals 오버라이딩과 main의 비교식)입니다.</p>
        ${C(`
class Point {
    int x, y;
    public Point(int x, int y) {
        this.x = x; this.y = y;
    }
    «public boolean equals(Object obj) {»
        «Point p = (Point)obj»;  // obj를 Point 타입으로 다운 캐스팅
        «if(x == p.x && y == p.y) return true;»
        «else return false;»
    «}»
}
public class EqualsEx {
    public static void main(String[] args) {
        Point a = new Point(2,3);
        Point b = new Point(2,3);
        Point c = new Point(3,4);
        if(«a == b») System.out.println("a==b");
        if(«a.equals(b)») System.out.println("a is equal to b");
        if(«a.equals(c)») System.out.println("a is equal to c");
    }
}
// 출력: a is equal to b`)}
        <div class="tip">왜 캐스팅하나 (39쪽): 매개변수 ${I('obj')}는 Object 타입이라 b가 가리키는 객체를 가리켜도 Object 영역만 접근할 수 있고 <b>x, y는 접근 못 함</b>. ${I('(Point)obj')}로 다운캐스팅해야 x, y에 접근할 수 있습니다.</div>
        <h4>예제 6-4 Rect 클래스: 면적이 같으면 같다</h4>
        ${C(`
class Rect {
    int width, height;
    public Rect(int width, int height) {
        this.width = width; this.height = height;
    }
    «public boolean equals(Object obj) {»
        «Rect p = (Rect)obj»;  // obj를 Rect 타입으로 다운 캐스팅
        «if (width*height == p.width*p.height) return true;»
        «else return false;»
    «}»
}
public class RectEx {
    public static void main(String[] args) {
        Rect a = new Rect(2,3); // 면적 6
        Rect b = new Rect(3,2); // 면적 6
        Rect c = new Rect(3,4); // 면적 12
        if(«a.equals(b)») System.out.println("a is equal to b");
        if(«a.equals(c)») System.out.println("a is equal to c");
        if(«b.equals(c)») System.out.println("b is equal to c");
    }
}
// 출력: a is equal to b`)}
        <div class="trap">함정: 매개변수 타입은 ${I('Object')}입니다. ${I('equals(Point obj)')}로 쓰면 오버라이딩이 아니라 오버로딩이 됩니다.</div>`,
    },
    {
      id: 'wrapper', title: '5. Wrapper 클래스 (41~46쪽)', prof: true,
      html: `
        <p>기본 타입을 클래스화한 8개 클래스. 용도: 객체만 쓸 수 있는 <b>컬렉션 등에 기본 타입 값을 넣기 위해</b>.</p>
        <table class="m"><tr><th>기본 타입</th><th>Wrapper</th></tr>
          <tr><td>${I('byte / short / int / long')}</td><td>${I('Byte / Short / Integer / Long')}</td></tr>
          <tr><td>${I('char')}</td><td>${I('Character')}</td></tr>
          <tr><td>${I('float / double / boolean')}</td><td>${I('Float / Double / Boolean')}</td></tr>
        </table>
        <div class="trap">함정: int는 ${I('Int')}가 아니라 ${I('Integer')}, char는 ${I('Char')}가 아니라 ${I('Character')}입니다.</div>
        <h4>객체 생성: valueOf()</h4>
        ${C(`
Integer i = «Integer.valueOf»(10);
Character c = Character.valueOf('c');
Double f = Double.valueOf(3.14);
Boolean b = Boolean.valueOf(true);
Integer I = «Integer.valueOf»("10");     // 문자열로도 생성
Double d = Double.valueOf("3.14");
Boolean b = Boolean.valueOf("false");
Float f = Float.valueOf((double) 3.14);
// Java 9부터 new Integer(10) 같은 생성자 방식은 폐기(deprecated)`)}
        <h4>Integer 주요 메소드 (43쪽)</h4>
        ${methods([
          ['static int parseInt(String s)', '스트링 s를 10진 정수로 변환한 값 리턴', true],
          ['static int parseInt(String s, int radix)', '스트링 s를 지정된 진법의 정수로 변환'],
          ['static String toString(int i)', '정수 i를 스트링으로 변환하여 리턴', true],
          ['static String toBinaryString(int i)', '정수 i를 이진수 표현 스트링으로'],
          ['static String toHexString(int i)', '정수 i를 16진수 표현 스트링으로'],
          ['static String toOctalString(int i)', '정수 i를 8진수 표현 스트링으로'],
          ['static int bitCount(int i)', '정수 i의 이진수 표현에서 1의 개수'],
          ['int intValue() / long longValue() …', '해당 타입으로 값 리턴'],
        ])}
        <h4>값 꺼내기 / 문자열 변환 (44~45쪽) ${P}</h4>
        ${C(`
Integer i = Integer.valueOf(10);
int ii = «i.intValue()»;               // 10
char cc = «c.charValue()»;             // 'c'
double dd = «d.doubleValue();»         // 3.14
boolean bb = «b.booleanValue();»       // true

int i = Integer«.parseInt("123");»             // 123
boolean b = Boolean.parseBoolean("true");      // true
double d = Double.parseDouble("3.14");         // 3.14

String s1 = Integer.«toString(123)»;      // "123"
String s2 = Integer.toHexString(123);     // "7b"
String s3 = Double.«toString(3.14)»;      // "3.14"
String s4 = Character.«toString('a');»    // "a"
String s5 = Boolean.«toString(true);»     // "true"`)}
        <h4>예제 6-5 Wrapper 클래스 활용</h4>
        ${C(`
System.out.println(«Integer.parseInt("28")»);       // 28
System.out.println(«Integer.toString(28)»);         // 28
System.out.println(«Integer.toBinaryString(28)»);   // 11100
System.out.println(«Integer.bitCount(28)»);         // 3
«Integer i = Integer.valueOf(28);»
System.out.println(«i.doubleValue()»);              // 28.0
«Double d = Double.valueOf(3.14);»
System.out.println(«d.toString()»);                 // 3.14
System.out.println(«Double.parseDouble("3.14")»);   // 3.14
«boolean b = (4>3);»
System.out.println(«Boolean.toString(b)»);          // true
System.out.println(«Boolean.parseBoolean("false")»);// false`)}`,
    },
    {
      id: 'boxing', title: '6. 박싱과 언박싱 (47~48쪽)', prof: true,
      html: `
        <ul>
          <li><b>박싱(boxing)</b>: 기본 타입의 값을 Wrapper 객체로 변환</li>
          <li><b>언박싱(unboxing)</b>: Wrapper 객체에 들어 있는 기본 타입의 값을 빼내는 것 (박싱의 반대)</li>
          <li><b>JDK 1.5부터</b> 자동 박싱, 자동 언박싱</li>
        </ul>
        ${C(`
Integer ten = Integer.valueOf(n);   // 박싱
int n = ten.intValue();             // 언박싱

«Integer ten = 10;»   // 자동 박싱.   Integer ten = Integer.valueOf(10);로 자동 처리
«int n = ten;»        // 자동 언박싱. int n = ten.intValue();로 자동 처리`)}
        <div class="tip">녹음 15:09: "박싱, 언박싱 이런 것들은 꼭 알아야 되고요." 정의를 단답으로 쓸 수 있게 외워 두세요.</div>`,
    },
    {
      id: 'string', title: '7. String의 생성과 특징 (49~51쪽)',
      html: `
        <ul>
          <li>스트링 리터럴("abcd")은 String 객체로 처리됨</li>
          <li><b>스트링 리터럴</b>: JVM 내부 <b>리터럴 테이블</b>에 저장되고 응용프로그램에서 <b>공유</b>됨</li>
          <li><b>new String()</b>: <b>힙</b>에 생성되고 <b>공유되지 않음</b></li>
          <li>String 객체는 <b>수정 불가능</b>. concat 등은 새 스트링을 리턴할 뿐 원본은 그대로</li>
          <li>두 스트링 비교는 반드시 ${I('equals()')}. ${I('==')}는 레퍼런스 비교라 절대 사용 금지</li>
        </ul>
        ${C(`
String str1 = "abcd";
char data[] = {'a', 'b', 'c', 'd'};
String str2 = new String(data);
String str3 = new String("abcd");   // str2와 str3은 모두 "abcd"

String a = "Hello";
String c = "Hello";              // a와 c는 리터럴 테이블의 같은 객체 → a == c 는 true
String d = new String("Hello");  // 힙의 새 객체 → a == d 는 false, a.equals(d) 는 true

String s = new String("Hello");
String t = s.concat("Java");     // t = "HelloJava", s는 여전히 "Hello"`)}`,
    },
    {
      id: 'strmethod', title: '8. String 주요 메소드 (52~56쪽)', prof: true,
      html: `
        <p>녹음 15:38: "제가 막 외우라고 하는 게 몇 가지가 있는데, 그거 <b>꼭 낼 거예요</b>." 메모: <b>52페이지 주요 메소드</b>.</p>
        ${methods([
          ['char charAt(int index)', 'index 인덱스에 있는 문자 리턴', true],
          ['int codePointAt(int index)', 'index 인덱스에 있는 유니코드 값 리턴'],
          ['int compareTo(String anotherString)', '사전 순 비교. 같으면 0, 앞이면 음수, 뒤면 양수', true],
          ['String concat(String str)', 'str을 현재 스트링 뒤에 덧붙인 스트링 리턴', true],
          ['boolean contains(CharSequence s)', 's를 포함하고 있으면 true', true],
          ['int length()', '스트링의 길이(문자 개수) 리턴', true],
          ['String replace(CharSequence target, CharSequence replacement)', 'target을 replacement로 변경한 스트링 리턴', true],
          ['String[] split(String regex)', 'regex를 기준으로 분리해 배열로 리턴', true],
          ['String substring(int beginIndex)', 'beginIndex부터 시작하는 서브 스트링 리턴', true],
          ['String toLowerCase()', '소문자로 변경한 스트링 리턴'],
          ['String toUpperCase()', '대문자로 변경한 스트링 리턴'],
          ['String trim()', '앞뒤 공백 문자들을 제거한 스트링 리턴', true],
        ])}
        <h4>equals()와 compareTo() (53~54쪽)</h4>
        ${C(`
String java = "Java";
if(java.equals("Java")) { ... }   // true

String cpp = "C++";
int res = java.compareTo(cpp);
if(res == 0)
    System.out.println("the same");
else if(res < 0)
    System.out.println(java + " < " + cpp);
else
    System.out.println(java + " > " + cpp);
// 출력: Java > C++   ("Java"가 "C++"보다 사전에 나중 → 양수)`)}
        <h4>trim() (55쪽)</h4>
        ${C(`
String a = " xyz\\t";
String b = a.trim();   // b = "xyz". 빈 칸과 '\\t' 제거됨`)}
        <h4>예제 6-6 String을 활용하여 문자열 다루기</h4>
        ${C(`
«String a = new String(" C#");»
«String b = new String(",C++ ");»
System.out.println(a + "의 길이는 " + «a.length()»); //  C#의 길이는 3
System.out.println(«a.contains("#")»);             // true
«a = a.concat(b);»           // a = " C#,C++ "
«a = a.trim();»              // a = "C#,C++"
«a = a.replace("C#","Java");»// a = "Java,C++"
«String s[] = a.split(",");»  // s[0] = "Java", s[1] = "C++"
for (int i=0; i<s.length; i++)
    System.out.println("분리된 문자열" + i + ": " + s[i]);
«a = a.substring(5);»        // a = "C++"   (인덱스 5부터 끝까지)
«char c = a.charAt(2);»      // c = '+'    (인덱스 2의 문자)`)}
        <div class="trap">함정: 문자열 길이는 ${I('length()')}(메소드), 배열 길이는 ${I('s.length')}(필드)입니다. " C#"은 앞의 공백까지 길이 3입니다.</div>`,
    },
    {
      id: 'buffer', title: '9. StringBuffer 클래스 (57쪽, 출제 불확실)',
      html: `
        <ul>
          <li><b>가변 스트링</b>을 다루는 클래스. 가변 크기 버퍼를 가지고 있어 문자열 <b>수정 가능</b></li>
          <li>문자열 수정이 많은 작업에 적합 (String은 수정 불가)</li>
        </ul>
        ${C(`
StringBuffer sb = new StringBuffer("This");
sb.append(" is pencil.");     // sb = "This is pencil."
sb.insert(7, " my");          // sb = "This is my pencil."
sb.replace(8, 10, "your");    // sb = "This is your pencil."
System.out.println(sb);       // "This is your pencil." 출력`)}
        <p class="maybe">녹음 15:48: "스트링버퍼? … 말한 것 중에 못 내는 것도 있겠는데."</p>`,
    },
    {
      id: 'tokenizer', title: '10. StringTokenizer 클래스 (58~60쪽)', prof: true,
      html: `
        <ul>
          <li>구분 문자를 기준으로 문자열을 분리하는 클래스 (${I('java.util')})</li>
          <li><b>구분 문자(delimiter)</b>: 문자열을 구분할 때 사용되는 문자</li>
          <li><b>토큰(token)</b>: 구분 문자로 분리된 문자열</li>
        </ul>
        ${C(`
String query = "name=kitae&addr=seoul&age=21";
StringTokenizer st = new StringTokenizer(query, "&");
int count = st.countTokens();   // 3
String token = st.nextToken();  // "name=kitae"

StringTokenizer st2 = new StringTokenizer(query, "&=");  // 구분 문자 2개: '&'와 '='
int count2 = st2.countTokens(); // 6  (name, kitae, addr, seoul, age, 21)`)}
        <h4>예제 6-7 StringTokenizer를 이용한 문자열 분리 ${P}</h4>
        ${C(`
import java.util.StringTokenizer;
public class StringTokenizerEx {
    public static void main(String[] args) {
        String query = "name=kitae&addr=seoul&age=21";
        StringTokenizer st = «new StringTokenizer(query, "&");»

        int n = «st.countTokens()»;          // 분리된 토큰 개수
        System.out.println("토큰 개수 = " + n);

        while(«st.hasMoreTokens()») {
            String token = «st.nextToken()»; // 토큰 얻기
            System.out.println(token);     // 토큰 출력
        }
    }
}
// 토큰 개수 = 3
// name=kitae
// addr=seoul
// age=21`)}
        <div class="tip">녹음 16:07~16:30: "와일문이랑 같이 쓴다… 다 알아내고 싶으면 hasMoreTokens, 하나 꺼낼 때는 nextToken. 이런 패턴은 컬렉션의 이터레이터에서도 했잖아요." → 7장 ${I('while(it.hasNext()) it.next()')}와 같은 모양입니다.</div>`,
    },
    {
      id: 'math', title: '11. Math 클래스 (61~62쪽, 출제 불확실)',
      html: `
        <ul>
          <li>기본 산술 연산 메소드 제공. <b>모든 메소드는 static</b> → 클래스 이름으로 호출</li>
          <li>${I('Math.random()')}: <b>0.0 이상 1.0 미만</b>의 실수 난수</li>
        </ul>
        ${C(`
int n = (int)(Math.random()*100 + 1);   // 1~100 정수 난수 (61쪽)
System.out.println(«Math.abs(-3.14)»);    // 3.14  절댓값 (예제 6-8)
System.out.println(«Math.sqrt(9.0)»);     // 3.0   제곱근
System.out.println(«Math.exp(2)»);        // 7.38905609893065  e²
System.out.println(«Math.round(3.14)»);   // 3     반올림
for (int i=0; i<5; i++)                    // [1, 45] 사이 정수 난수 5개
    System.out.print((int)(«Math.random()»*45 + 1) + " ");
// java.util.Random 클래스로도 가능
Random r = new Random();
int m = r.nextInt(100);   // 0~99`)}
        <p class="maybe">녹음 16:34: "메스(Math)는 낼 수도 있고 안 낼 수도 있겠지?"</p>`,
    },
    {
      id: 'results', title: '12. 예제 결과 한눈에',
      html: `
        <table class="m"><tr><th>예제</th><th>결과</th></tr>
          <tr><td>6-1 Object</td><td>Point / 해시코드 / Point@153f67e</td></tr>
          <tr><td>6-2 toString</td><td>Point(2,3) / Point(2,3) / Point(2,3) 입니다.</td></tr>
          <tr><td>6-3 equals</td><td>a is equal to b</td></tr>
          <tr><td>6-4 Rect equals</td><td>a is equal to b (면적 6 = 6)</td></tr>
          <tr><td>6-5 Wrapper</td><td>a / 4는 숫자 / F는 영문자 / 28 / 28 / 11100 / 3 / 28.0 / 3.14 / 3.14 / true / false</td></tr>
          <tr><td>6-6 String</td><td>" C#의 길이는 3" / true / " C#,C++" / C#,C++ / Java,C++ / 분리된 문자열0: Java / 분리된 문자열1: C++ / C++ / +</td></tr>
          <tr><td>6-7 Tokenizer</td><td>토큰 개수 = 3 / name=kitae / addr=seoul / age=21</td></tr>
          <tr><td>6-8 Math</td><td>3.14 / 3.0 / 7.389… / 3 / 난수 5개</td></tr>
        </table>`,
    },
  ];

  const cards = [
    { q: '모든 자바 클래스의 최상위 클래스', a: 'Object (java.lang 패키지)' },
    { q: '객체를 문자열로 변환하는 Object 메소드 (시그니처)', a: 'public String toString()', prof: true },
    { q: '두 객체의 내용물을 비교하는 Object 메소드 (시그니처)', a: 'public boolean equals(Object obj)', prof: true },
    { q: 'Object의 기본 toString()이 리턴하는 형식', a: '클래스명@해시코드값  예) Point@15db9742' },
    { q: '== 연산자는 무엇을 비교하나', a: '객체 레퍼런스(같은 객체를 가리키는가)' },
    { q: 'equals() 안에서 Object obj를 Point로 바꾸는 코드', a: 'Point p = (Point)obj;', note: '다운캐스팅해야 x, y에 접근 가능', prof: true },
    { q: 'System.out.println(a); 에서 자동으로 호출되는 것', a: 'a.toString()', prof: true },
    { q: '객체의 클래스 이름 얻기', a: 'obj.getClass().getName()' },
    { q: 'int / char 의 Wrapper 클래스', a: 'Integer / Character' },
    { q: '문자열 "123"을 정수로', a: 'Integer.parseInt("123")', prof: true },
    { q: '문자열 "3.14"를 double로', a: 'Double.parseDouble("3.14")', prof: true },
    { q: '문자열 "true"를 boolean으로', a: 'Boolean.parseBoolean("true")', prof: true },
    { q: '정수 123을 문자열로', a: 'Integer.toString(123)', prof: true },
    { q: '정수를 2진수 / 16진수 문자열로', a: 'Integer.toBinaryString(i) / Integer.toHexString(i)' },
    { q: 'Integer 객체에서 int 값 꺼내기', a: 'i.intValue()' },
    { q: 'Wrapper 객체 생성 (Java 9 이후 권장)', a: 'Integer.valueOf(10)', note: 'new Integer(10)은 폐기' },
    { q: '박싱이란', a: '기본 타입의 값을 Wrapper 객체로 변환하는 것', prof: true },
    { q: '언박싱이란', a: 'Wrapper 객체에 들어 있는 기본 타입의 값을 빼내는 것', prof: true },
    { q: '자동 박싱/언박싱 도입 버전', a: 'JDK 1.5' },
    { q: '스트링 리터럴은 어디에 저장되나', a: 'JVM의 리터럴 테이블 (공유됨)', note: 'new String()은 힙, 공유 안 됨' },
    { q: 'index 위치의 문자 리턴', a: 'char charAt(int index)', prof: true },
    { q: '사전 순 비교, 같으면 0', a: 'int compareTo(String anotherString)', prof: true },
    { q: '문자열 뒤에 덧붙이기', a: 'String concat(String str)', prof: true },
    { q: 's를 포함하면 true', a: 'boolean contains(CharSequence s)', prof: true },
    { q: '문자열 길이', a: 'int length()', prof: true },
    { q: '문자열 일부를 다른 문자열로 바꾸기', a: 'String replace(target, replacement)', prof: true },
    { q: '구분자로 잘라 배열로', a: 'String[] split(String regex)', prof: true },
    { q: 'beginIndex부터 끝까지 잘라내기', a: 'String substring(int beginIndex)', prof: true },
    { q: '앞뒤 공백 제거', a: 'String trim()', prof: true },
    { q: '수정 가능한 가변 문자열 클래스', a: 'StringBuffer', note: 'append / insert / replace' },
    { q: 'StringTokenizer: 토큰 개수', a: 'int countTokens()', prof: true },
    { q: 'StringTokenizer: 토큰이 남았는지', a: 'boolean hasMoreTokens()', prof: true },
    { q: 'StringTokenizer: 다음 토큰 얻기', a: 'String nextToken()', prof: true },
    { q: '구분 문자 / 토큰의 뜻', a: '구분 문자(delimiter): 문자열을 구분하는 문자 / 토큰: 구분 문자로 분리된 문자열' },
    { q: 'Math.random()의 범위', a: '0.0 이상 1.0 미만' },
  ];

  const quiz = [
    // 코드 빈칸
    { id: 'c1', prof: true, type: 'code', q: '예제 6-3: x, y가 같으면 true를 리턴하는 equals()를 완성하세요.',
      code: `class Point {
    int x, y;
    public Point(int x, int y) {
        this.x = x; this.y = y;
    }
    public {{1}} equals({{2}} obj) {
        Point p = {{3}}obj;
        if(x == p.x && y == p.y) return {{4}};
        else return false;
    }
}
public class EqualsEx {
    public static void main(String[] args) {
        Point a = new Point(2,3);
        Point b = new Point(2,3);
        if(a.{{5}}(b)) System.out.println("a is equal to b");
    }
}`,
      blanks: ['boolean', 'Object', '(Point)', 'true', 'equals'],
      explain: 'Object의 equals를 오버라이딩하므로 시그니처는 public boolean equals(Object obj)입니다. obj는 Object 타입이라 (Point)로 다운캐스팅해야 x, y에 접근할 수 있습니다.' },
    { id: 'c2', prof: true, type: 'code', q: '예제 6-2: Point 객체를 "Point(2,3)" 형태로 출력하도록 완성하세요.',
      code: `class Point {
    private int x, y;
    public Point(int x, int y) {
        this.x = x; this.y = y;
    }
    public {{1}} {{2}}() {
        {{3}} "Point(" + x + "," + y + ")";
    }
}
public class ToStringEx {
    public static void main(String [] args) {
        Point a = new Point(2,3);
        System.out.println(a);  // a는 a.{{4}}()으로 자동 변환됨
    }
}`,
      blanks: ['String', 'toString', 'return', 'toString'],
      explain: 'public String toString()을 오버라이딩합니다. 객체를 단독으로 출력하거나 문자열과 +하면 toString()이 자동 호출됩니다.' },
    { id: 'c3', prof: true, type: 'code', q: '예제 6-4: 면적이 같으면 같은 Rect로 판별하는 equals()를 완성하세요.',
      code: `class Rect {
    int width, height;
    public Rect(int width, int height) {
        this.width = width; this.height = height;
    }
    public boolean equals(Object obj) {
        Rect p = {{1}}obj;
        if ({{2}} == p.width*p.height) return true;
        else return {{3}};
    }
}`,
      blanks: ['(Rect)', ['width*height', 'this.width*this.height', 'height*width'], 'false'],
      explain: '이번엔 Rect로 다운캐스팅합니다. 자기 면적(width*height)과 p의 면적을 비교합니다.' },
    { id: 'c4', prof: true, type: 'code', q: '문자열과 기본 타입을 서로 변환하는 코드를 완성하세요. (45쪽)',
      code: `int i = Integer.{{1}}("123");          // i = 123
boolean b = Boolean.{{2}}("true");     // b = true
double d = Double.{{3}}("3.14");       // d = 3.14

String s1 = Integer.{{4}}(123);        // "123"
String s2 = Integer.{{5}}(123);        // "7b" (16진수)`,
      blanks: ['parseInt', 'parseBoolean', 'parseDouble', 'toString', 'toHexString'],
      explain: '문자열 → 기본 타입은 parseXxx(), 기본 타입 → 문자열은 toString()입니다. 16진수 문자열은 toHexString()입니다.' },
    { id: 'c5', prof: true, type: 'code', q: '박싱과 언박싱 코드를 완성하세요. (44, 47~48쪽)',
      code: `Integer ten = Integer.{{1}}(10);     // 박싱
int n = ten.{{2}}();                  // 언박싱

Character c = Character.valueOf('c');
char cc = c.{{3}}();                  // cc = 'c'

Integer t2 = 10;     // 자동 박싱:  Integer t2 = Integer.valueOf(10);
int m = t2;          // 자동 언박싱: int m = t2.{{4}}();`,
      blanks: ['valueOf', 'intValue', 'charValue', 'intValue'],
      explain: '박싱은 valueOf(), 언박싱은 xxxValue()입니다. JDK 1.5부터는 컴파일러가 자동으로 넣어 줍니다.' },
    { id: 'c6', prof: true, type: 'code', q: '예제 6-6: 주석의 결과가 나오도록 String 메소드를 채우세요.',
      code: `String a = new String(" C#");
String b = new String(",C++ ");
System.out.println(a.{{1}}());          // 3
System.out.println(a.{{2}}("#"));       // true
a = a.{{3}}(b);                         // a = " C#,C++ "
a = a.{{4}}();                          // a = "C#,C++"
a = a.{{5}}("C#","Java");               // a = "Java,C++"
String s[] = a.{{6}}(",");              // s[0]="Java", s[1]="C++"`,
      blanks: ['length', 'contains', 'concat', 'trim', 'replace', 'split'],
      explain: 'length 길이, contains 포함 여부, concat 연결, trim 앞뒤 공백 제거, replace 대치, split 분리입니다.' },
    { id: 'c7', prof: true, type: 'code', ex: '54쪽', q: '스트링 비교 코드를 완성하세요. (53~54쪽) 출력: 같다 / Java > C++',
      code: `String java = "Java";
if(java.{{1}}("Java")) System.out.println("같다");

String cpp = "C++";
int res = java.{{2}}(cpp);
if(res == {{3}})
    System.out.println("the same");
else if(res < 0)
    System.out.println(java + " < " + cpp);
else
    System.out.println(java + " > " + cpp);

String a = "Java,C++";
a = a.{{4}}(5);        // a = "C++"
char c = a.{{5}}(2);   // c = '+'`,
      blanks: ['equals', 'compareTo', '0', 'substring', 'charAt'],
      explain: '스트링 비교는 == 대신 equals(), 사전 순 비교는 compareTo()이며 같으면 0입니다. substring(5)는 인덱스 5부터 끝까지, charAt(2)는 인덱스 2의 문자입니다.' },
    { id: 'c8', prof: true, type: 'code', q: '예제 6-7: "&"로 분리해 토큰 개수와 모든 토큰을 출력하세요.',
      code: `import java.util.{{1}};
public class StringTokenizerEx {
    public static void main(String[] args) {
        String query = "name=kitae&addr=seoul&age=21";
        StringTokenizer st = new StringTokenizer(query, {{2}});

        int n = st.{{3}}();
        System.out.println("토큰 개수 = " + n);

        while(st.{{4}}()) {
            String token = st.{{5}}();
            System.out.println(token);
        }
    }
}`,
      blanks: ['StringTokenizer', '"&"', 'countTokens', 'hasMoreTokens', 'nextToken'],
      explain: 'StringTokenizer는 java.util 패키지입니다. 구분 문자는 문자열 "&"로 줍니다. while(hasMoreTokens()) 안에서 nextToken()으로 하나씩 꺼내는 패턴을 외우세요.' },
    { id: 'c9', type: 'code', q: 'StringBuffer 조작 코드를 완성하세요. (57쪽)',
      code: `StringBuffer sb = new StringBuffer("This");
sb.{{1}}(" is pencil.");      // sb = "This is pencil."
sb.{{2}}(7, " my");           // sb = "This is my pencil."
sb.{{3}}(8, 10, "your");      // sb = "This is your pencil."
System.out.println(sb);`,
      blanks: ['append', 'insert', 'replace'],
      explain: 'append 뒤에 붙이기, insert(위치, 문자열) 삽입, replace(시작, 끝, 문자열) 대치입니다. StringBuffer는 문자열 자체가 바뀝니다.' },
    { id: 'c11', type: 'code', q: '예제 6-1: Object 메소드로 클래스 이름, 해시 코드, 문자열을 출력하세요.',
      code: `Point p = new Point(2,3);
System.out.println(p.{{1}}().getName());  // Point
System.out.println(p.{{2}}());            // 22279806 (실행마다 다름)
System.out.println(p.{{3}}());            // Point@153f67e`,
      blanks: ['getClass', 'hashCode', 'toString'],
      explain: 'getClass()는 Class 객체를 리턴하고 그 getName()이 클래스 이름입니다. toString()을 오버라이딩하지 않으면 클래스명@해시코드가 나옵니다.' },
    { id: 'c12', type: 'code', q: '예제 6-5: 주석의 결과가 나오도록 Wrapper 메소드를 채우세요.',
      code: `System.out.println(Integer.{{1}}("28"));     // 28 (문자열 → 정수)
System.out.println(Integer.{{2}}(28));       // 3  (2진수에서 1의 개수)
Integer i = Integer.{{3}}(28);
System.out.println(i.{{4}}());               // 28.0
Double d = Double.valueOf(3.14);
System.out.println(Double.{{5}}("3.14"));    // 3.14 (문자열 → 실수)
boolean b = (4>3);
System.out.println(Boolean.{{6}}(b));        // "true" (불린 → 문자열)`,
      blanks: ['parseInt', 'bitCount', 'valueOf', 'doubleValue', 'parseDouble', 'toString'],
      explain: '예제 6-5의 진한 글씨 부분입니다. parseXxx는 문자열 → 기본 타입, toString은 기본 타입 → 문자열, valueOf는 Wrapper 객체 생성입니다.' },
    { id: 'c13', type: 'code', q: '예제 6-8: Math 메소드를 채우세요. (출제 불확실)',
      code: `System.out.println(Math.{{1}}(-3.14));   // 3.14 절댓값
System.out.println(Math.{{2}}(9.0));     // 3.0 제곱근
System.out.println(Math.{{3}}(3.14));    // 3 반올림
for (int i=0; i<5; i++)                  // [1, 45] 사이 정수 난수 5개
    System.out.print((int)(Math.{{4}}()*45 + 1) + " ");`,
      blanks: ['abs', 'sqrt', 'round', 'random'],
      explain: 'Math의 메소드는 모두 static입니다. random()은 0.0 이상 1.0 미만이라 *45 + 1 후 int로 바꾸면 1~45입니다.' },

    // 단답형
    { id: 's1', type: 'short', q: '모든 자바 클래스가 자동으로 상속받는 최상위 클래스의 이름은?', answers: ['Object', 'java.lang.Object'],
      explain: '모든 클래스는 Object를 상속받도록 자동 컴파일됩니다.' },
    { id: 's2', prof: true, type: 'short', q: '객체를 문자열로 변환해 리턴하는 Object의 메소드 이름은?', answers: ['toString', 'String toString()', 'public String toString()'],
      explain: '기본 구현은 "클래스명@해시코드"를 리턴하고, 보통 오버라이딩해서 씁니다.' },
    { id: 's3', prof: true, type: 'short', q: '두 객체의 내용물이 같은지 비교하려면 오버라이딩해야 하는 Object의 메소드 이름은?', answers: ['equals', 'boolean equals(Object obj)', 'public boolean equals(Object obj)'],
      explain: '== 는 레퍼런스 비교이고, 내용 비교는 equals()를 오버라이딩해서 합니다.' },
    { id: 's4', prof: true, type: 'short', q: '기본 타입의 값을 Wrapper 객체로 변환하는 것을 무엇이라 하나?', answers: ['박싱', 'boxing', '박싱(boxing)'],
      explain: '반대로 Wrapper 객체에서 값을 빼내는 것은 언박싱입니다.' },
    { id: 's5', prof: true, type: 'short', q: 'Wrapper 객체에 들어 있는 기본 타입의 값을 빼내는 것을 무엇이라 하나?', answers: ['언박싱', 'unboxing', '언박싱(unboxing)'],
      explain: '예: int n = ten.intValue();' },
    { id: 's6', prof: true, type: 'short', q: '문자열 "28"을 정수 28로 변환하는 Integer 클래스의 static 메소드 이름은?', answers: ['parseInt', 'Integer.parseInt'],
      explain: 'static int parseInt(String s)' },
    { id: 's7', type: 'short', q: 'char 타입에 대응하는 Wrapper 클래스의 이름은?', answers: ['Character'],
      explain: 'Char가 아니라 Character입니다. int는 Integer입니다.' },
    { id: 's8', prof: true, type: 'short', q: '스트링 앞뒤의 공백 문자를 제거한 스트링을 리턴하는 String 메소드 이름은?', answers: ['trim', 'String trim()'],
      explain: '" xyz\\t".trim() → "xyz"' },
    { id: 's9', prof: true, type: 'short', q: '두 스트링을 사전 순으로 비교해 같으면 0을 리턴하는 String 메소드 이름은?', answers: ['compareTo', 'int compareTo(String anotherString)'],
      explain: '앞이면 음수, 뒤면 양수입니다.' },
    { id: 's10', prof: true, type: 'short', q: 'StringTokenizer에서 다음 토큰을 얻는 메소드 이름은?', answers: ['nextToken', 'String nextToken()'],
      explain: 'while(st.hasMoreTokens()) { st.nextToken(); }' },
    { id: 's11', type: 'short', q: '구분 문자(delimiter)로 분리된 각각의 문자열을 무엇이라 하나?', answers: ['토큰', 'token', '토큰(token)'],
      explain: '문자열을 구분하는 문자는 구분 문자(delimiter)입니다.' },
    { id: 's12', type: 'short', q: 'String과 달리 문자열을 수정할 수 있는 가변 스트링 클래스의 이름은?', answers: ['StringBuffer'],
      explain: 'append, insert, replace로 문자열 자체를 바꿉니다.' },
    { id: 's13', type: 'short', q: '자바에서 자동으로 import되어 import 문이 필요 없는 패키지는?', answers: ['java.lang'],
      explain: 'String, Object, Math, Wrapper 클래스가 들어 있습니다.' },

    // 객관식
    { id: 'm1', prof: true, type: 'mcq', q: '== 연산자와 equals()에 대한 설명으로 옳은 것은?',
      choices: ['==는 레퍼런스를, equals()는 내용물을 비교한다', '==는 내용물을, equals()는 레퍼런스를 비교한다', '둘 다 내용물을 비교한다', '스트링 비교에는 ==를 써야 한다'], answer: 0,
      explain: '==는 같은 객체를 가리키는지, equals()는 내용이 같은지 비교합니다. 스트링 비교에 ==는 절대 금지입니다.' },
    { id: 'm2', prof: true, type: 'mcq', mono: true, ex: '6-3', q: 'Point 클래스에서 equals()를 올바르게 오버라이딩한 선언은?',
      choices: ['public boolean equals(Object obj)', 'public boolean equals(Point obj)', 'public int equals(Object obj)', 'boolean equal(Object obj)'], answer: 0,
      explain: '매개변수가 Point이면 오버라이딩이 아니라 오버로딩입니다. 이름, 리턴 타입, 매개변수가 Object의 것과 같아야 합니다.' },
    { id: 'm3', type: 'mcq', q: 'equals(Object obj) 안에서 (Point)obj로 캐스팅하는 이유는?',
      choices: ['Object 타입으로는 Point의 x, y에 접근할 수 없어서', '캐스팅하지 않으면 실행 속도가 느려서', 'obj가 null이 되지 않게 하려고', 'Point가 Object의 부모 클래스라서'], answer: 0,
      explain: 'obj는 Object 영역만 접근할 수 있습니다. Point로 다운캐스팅해야 x, y에 접근합니다.' },
    { id: 'm4', type: 'mcq', q: 'Object 클래스의 메소드가 아닌 것은?',
      choices: ['length()', 'toString()', 'equals()', 'hashCode()'], answer: 0,
      explain: 'length()는 String의 메소드입니다. Object에는 equals, getClass, hashCode, toString, notify, notifyAll, wait가 있습니다.' },
    { id: 'm5', type: 'mcq', q: 'Wrapper 클래스가 아닌 것은?',
      choices: ['String', 'Integer', 'Character', 'Boolean'], answer: 0,
      explain: 'Wrapper는 8개 기본 타입에 대응하는 Byte, Short, Integer, Long, Character, Float, Double, Boolean입니다.' },
    { id: 'm6', type: 'mcq', q: 'Wrapper 클래스를 쓰는 주된 이유는?',
      choices: ['객체만 쓸 수 있는 컬렉션 등에 기본 타입 값을 넣기 위해', '연산 속도를 높이기 위해', '메모리를 절약하기 위해', '상속을 막기 위해'], answer: 0,
      explain: '41쪽 용도: 객체만 사용할 수 있는 컬렉션 등에 기본 타입의 값을 사용하기 위해.' },
    { id: 'm7', type: 'mcq', q: '스트링 리터럴과 new String()에 대한 설명으로 틀린 것은?',
      choices: ['new String()으로 만든 스트링은 리터럴 테이블에서 공유된다', '스트링 리터럴은 JVM의 리터럴 테이블에 저장된다', 'new String()으로 만든 스트링은 힙에 생성된다', 'String 객체는 한 번 만들면 수정할 수 없다'], answer: 0,
      explain: 'new String()은 힙에 생성되며 공유되지 않습니다. 공유되는 것은 리터럴입니다.' },
    { id: 'm8', type: 'mcq', q: 'String s = new String("Hello"); String t = s.concat("Java"); 실행 후 s의 값은?',
      choices: ['"Hello"', '"HelloJava"', '"Java"', 'null'], answer: 0,
      explain: 'String은 수정 불가능합니다. concat은 새 스트링을 리턴하고 s는 그대로입니다.' },
    { id: 'm9', prof: true, type: 'mcq', mono: true, q: '"a,b,c"를 쉼표로 잘라 배열로 만드는 메소드는?',
      choices: ['split(",")', 'substring(",")', 'trim(",")', 'replace(",")'], answer: 0,
      explain: 'String[] split(String regex)' },
    { id: 'm10', prof: true, type: 'mcq', q: 'StringTokenizer로 모든 토큰을 출력하는 while문의 조건으로 알맞은 것은?',
      choices: ['st.hasMoreTokens()', 'st.nextToken()', 'st.countTokens()', 'st.hasNext()'], answer: 0,
      explain: 'while(st.hasMoreTokens()) { String token = st.nextToken(); } 패턴입니다. hasNext()는 Iterator의 메소드입니다.' },
    { id: 'm11', type: 'mcq', q: 'Math.random()이 리턴하는 값의 범위는?',
      choices: ['0.0 이상 1.0 미만', '0.0 초과 1.0 이하', '0 이상 100 미만 정수', '-1.0 이상 1.0 미만'], answer: 0,
      explain: '1~100 정수 난수는 (int)(Math.random()*100 + 1)로 만듭니다.' },
    { id: 'm12', type: 'mcq', q: 'StringTokenizer 클래스가 속한 패키지는?',
      choices: ['java.util', 'java.lang', 'java.io', 'java.awt'], answer: 0,
      explain: '그래서 import java.util.StringTokenizer;가 필요합니다.' },

    // 출력 예측
    { id: 'u1', prof: true, type: 'output', q: '출력 결과는? (36쪽)',
      code: 'Point a = new Point(2,3);\nPoint b = new Point(2,3);\nPoint c = a;\nif(a == b) System.out.println("a==b");\nif(a == c) System.out.println("a==c");',
      choices: ['a==c', 'a==b', 'a==b\na==c', '아무것도 출력 안 됨'], answer: 0,
      explain: 'a와 b는 서로 다른 객체라 == 는 false, c는 a와 같은 객체를 가리키므로 true입니다.' },
    { id: 'u2', prof: true, type: 'output', q: '출력 결과는? (예제 6-3, Point에 equals 오버라이딩됨)',
      code: 'Point a = new Point(2,3);\nPoint b = new Point(2,3);\nPoint c = new Point(3,4);\nif(a == b) System.out.println("a==b");\nif(a.equals(b)) System.out.println("a is equal to b");\nif(a.equals(c)) System.out.println("a is equal to c");',
      choices: ['a is equal to b', 'a==b\na is equal to b', 'a is equal to b\na is equal to c', 'a==b'], answer: 0,
      explain: 'a와 b는 다른 객체(== false)지만 좌표가 같아 equals는 true입니다.' },
    { id: 'u3', type: 'output', q: '출력 결과는? (예제 6-4, 면적 비교 equals)',
      code: 'Rect a = new Rect(2,3);\nRect b = new Rect(3,2);\nRect c = new Rect(3,4);\nif(a.equals(b)) System.out.println("a is equal to b");\nif(a.equals(c)) System.out.println("a is equal to c");\nif(b.equals(c)) System.out.println("b is equal to c");',
      choices: ['a is equal to b', 'a is equal to c', '아무것도 출력 안 됨', 'a is equal to b\nb is equal to c'], answer: 0,
      explain: '면적 a=6, b=6, c=12이므로 a와 b만 같습니다.' },
    { id: 'u4', prof: true, type: 'output', ex: '6-2', q: '출력 결과는? (toString 오버라이딩된 Point)',
      code: 'Point a = new Point(2,3);\nSystem.out.println(a + " 입니다.");',
      choices: ['Point(2,3) 입니다.', 'Point@15db9742 입니다.', 'a 입니다.', '컴파일 오류'], answer: 0,
      explain: '객체 + 문자열은 a.toString() + 문자열로 자동 변환됩니다.' },
    { id: 'u5', prof: true, type: 'output', ex: '54쪽', q: '출력 결과는? (54쪽)',
      code: 'String java = "Java";\nString cpp = "C++";\nint res = java.compareTo(cpp);\nif(res == 0) System.out.println("the same");\nelse if(res < 0) System.out.println(java + " < " + cpp);\nelse System.out.println(java + " > " + cpp);',
      choices: ['Java > C++', 'Java < C++', 'the same', '컴파일 오류'], answer: 0,
      explain: '"Java"가 "C++"보다 사전에 나중에 나오므로 양수가 리턴됩니다.' },
    { id: 'u6', prof: true, type: 'output', q: '출력 결과는? (예제 6-6)',
      code: 'String a = "Java,C++";\na = a.substring(5);\nchar c = a.charAt(2);\nSystem.out.println(a + " " + c);',
      choices: ['C++ +', 'C++ C', ',C++ +', 'Java +'], answer: 0,
      explain: 'substring(5)는 인덱스 5부터 끝까지 "C++", charAt(2)는 인덱스 2의 문자 \'+\'입니다.' },
    { id: 'u7', prof: true, type: 'output', q: '출력 결과는?',
      code: 'String a = " C#";\nString b = ",C++ ";\nSystem.out.println(a.length());\na = a.concat(b).trim();\nSystem.out.println(a);',
      choices: ['3\nC#,C++', '2\nC#,C++', '3\n C#,C++ ', '2\n C#,C++'], answer: 0,
      explain: '" C#"은 공백 포함 3글자입니다. concat 후 trim으로 앞뒤 공백이 제거됩니다.' },
    { id: 'u8', prof: true, type: 'output', q: '출력 결과는? (구분 문자 2개)',
      code: 'String query = "name=kitae&addr=seoul&age=21";\nStringTokenizer st = new StringTokenizer(query, "&=");\nSystem.out.println(st.countTokens());\nSystem.out.println(st.nextToken());',
      choices: ['6\nname', '3\nname=kitae', '6\nname=kitae', '3\nname'], answer: 0,
      explain: '"&="는 \'&\'와 \'=\' 두 개의 구분 문자입니다. 토큰 6개, 첫 토큰은 "name"입니다.' },
    { id: 'u9', type: 'output', q: '출력 결과는? (예제 6-5)',
      code: 'System.out.println(Integer.toBinaryString(28));\nSystem.out.println(Integer.bitCount(28));\nInteger i = Integer.valueOf(28);\nSystem.out.println(i.doubleValue());',
      choices: ['11100\n3\n28.0', '11100\n5\n28', '28\n3\n28.0', '11010\n3\n28.0'], answer: 0,
      explain: '28 = 11100(2), 1의 개수 3개, doubleValue()는 28.0입니다.' },
    { id: 'u10', type: 'output', q: '출력 결과는?',
      code: 'String a = "Hello";\nString c = "Hello";\nString d = new String("Hello");\nSystem.out.println(a == c);\nSystem.out.println(a == d);\nSystem.out.println(a.equals(d));',
      choices: ['true\nfalse\ntrue', 'true\ntrue\ntrue', 'false\nfalse\ntrue', 'true\nfalse\nfalse'], answer: 0,
      explain: '리터럴은 공유되어 a == c는 true, new String()은 힙의 새 객체라 a == d는 false, 내용은 같아 equals는 true입니다.' },

    // OX
    { id: 'o1', type: 'ox', q: 'String 클래스는 equals() 메소드를 오버라이딩해 두었기 때문에 문자열 내용 비교에 equals()를 쓸 수 있다.',
      choices: ['O', 'X'], answer: 0, explain: '37쪽: String 클래스는 문자열이 같은지 비교하는 equals를 오버라이딩하여 가지고 있습니다.' },
    { id: 'o2', type: 'ox', q: 'JDK 1.5부터 박싱과 언박싱은 자동으로 이루어진다.',
      choices: ['O', 'X'], answer: 0, explain: 'Integer ten = 10; int n = ten; 이 자동으로 처리됩니다.' },
    { id: 'o3', type: 'ox', q: 'String 객체의 문자열은 concat()으로 수정할 수 있다.',
      choices: ['O', 'X'], answer: 1, explain: 'String은 수정 불가능합니다. concat은 덧붙인 새 스트링을 리턴합니다. 수정 가능한 건 StringBuffer입니다.' },
    { id: 'o4', type: 'ox', q: 'Math 클래스의 메소드는 모두 static이라 클래스 이름으로 호출할 수 있다.',
      choices: ['O', 'X'], answer: 0, explain: 'Math.abs(), Math.sqrt()처럼 객체 없이 호출합니다.' },
    { id: 'o5', type: 'ox', q: 'Java 9부터 new Integer(10)처럼 생성자로 Wrapper 객체를 만드는 방식은 폐기되었다.',
      choices: ['O', 'X'], answer: 0, explain: '42쪽: Java 9부터 생성자를 이용한 Wrapper 객체 생성 폐기. Integer.valueOf(10)을 씁니다.' },
  ];

  window.CHAPTER_DATA = window.CHAPTER_DATA || {};
  window.CHAPTER_DATA['06'] = { sections, cards, quiz };
})();
