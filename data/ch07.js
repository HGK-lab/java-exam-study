(function () {
  const E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const I = s => `<code>${E(s)}</code>`;
  const C = s => `<pre><code>${E(s.trim())}</code></pre>`;
  const P = '{{PROF}}';
  const methods = (rows, cls) => `<table class="m"><tr><th>메서드</th><th>설명</th></tr>${rows.map(([m, d, prof]) =>
    `<tr class="${prof ? 'hl' : ''}"><td>${I(m)}</td><td>${E(d.replace('{C}', cls))} ${prof ? P : ''}</td></tr>`).join('')}</table>`;

  const listMethods = [
    ['boolean add(E element)', '{C}의 맨 뒤에 element 추가'],
    ['void add(int index, E element)', '인덱스 index에 element 삽입', true],
    ['int capacity()', '현재 용량 리턴 (Vector만 있음)'],
    ['boolean addAll(Collection<? extends E> c)', '컬렉션 c의 모든 요소를 맨 뒤에 추가'],
    ['void clear()', '모든 요소 삭제'],
    ['boolean contains(Object o)', 'o를 포함하면 true'],
    ['E elementAt(int index)', '인덱스 index의 요소 리턴'],
    ['E get(int index)', '인덱스 index의 요소 리턴', true],
    ['int indexOf(Object o)', 'o와 같은 첫 요소의 인덱스, 없으면 -1'],
    ['boolean isEmpty()', '비어 있으면 true'],
    ['E remove(int index)', '인덱스 index의 요소 삭제'],
    ['boolean remove(Object o)', 'o와 같은 첫 요소 삭제'],
    ['void removeAllElements()', '모든 요소 삭제, 크기 0 (Vector)'],
    ['int size()', '요소의 개수 리턴', true],
    ['Object[] toArray()', '모든 요소를 담은 배열 리턴'],
  ];

  const sections = [
    {
      title: '1. 컬렉션이란?', open: true,
      html: `
        <p><b>컬렉션</b>은 객체를 쉽게 삽입, 삭제, 검색할 수 있는 <b>가변 크기 컨테이너</b>입니다.</p>
        <ul>
          <li>요소 개수에 따라 크기가 <b>자동 조절</b>됨</li>
          <li>삽입, 삭제 시 요소 위치가 <b>자동 이동</b>됨</li>
          <li>고정 크기인 <b>배열의 단점을 개선</b>함</li>
        </ul>
        <div class="tip">배열 ${I('Fruit[] fruit = new Fruit[7];')}은 7개를 넘게 담을 수 없고, 중간 요소를 지우면 프로그램이 직접 자리를 옮겨야 합니다. 컬렉션은 둘 다 알아서 처리합니다.</div>`,
    },
    {
      title: '2. 컬렉션 인터페이스와 클래스 계층',
      html: `
        ${C(`
Collection<E>            Map<K, V>     ← 인터페이스
 ├ Set<E>                   │
 │  └ HashSet<E>            └ HashMap<K, V>
 ├ List<E>
 │  ├ ArrayList<E>
 │  ├ Vector<E> ── Stack<E>
 │  └ LinkedList<E>
 └ Queue<E>
    └ LinkedList<E>`)}
        <ul>
          <li>${I('Map<K,V>')}는 ${I('Collection<E>')}과 <b>별개</b>의 계층입니다.</li>
          <li>${I('Stack<E>')}은 ${I('Vector<E>')}를 상속합니다.</li>
          <li>${I('LinkedList<E>')}는 List와 Queue를 모두 구현합니다.</li>
        </ul>`,
    },
    {
      title: '3. 제네릭(generics) 개념',
      html: `
        <ul>
          <li>특정 타입만 다루지 않고 <b>여러 타입으로 변신</b>할 수 있도록 클래스나 메서드를 일반화하는 기법</li>
          <li>이름 옆에 ${I('<E>')}, ${I('<K>')}, ${I('<V>')} 같은 <b>타입 매개변수</b>가 붙음</li>
          <li>비유: <b>형판</b>. 금을 넣으면 금 사과, 은을 넣으면 은 사과가 나옴</li>
          <li><b>JDK 1.5</b>(2004년)부터 도입, C++의 <b>템플릿</b>과 같음</li>
          <li>타입 매개변수에 구체적인 타입을 넣어 객체를 만드는 것을 <b>구체화</b>라고 함</li>
        </ul>
        ${C(`
Vector<Integer>   // 정수만 다루는 벡터
Vector<String>    // 문자열만 다루는 벡터
Stack<Integer>    // E → Integer 로 구체화`)}
        <div class="tip">타입 매개변수 없이 ${I('Vector v = new Vector();')}로 쓰면 컴파일 <b>경고</b>(raw type)가 납니다. 오류는 아닙니다.</div>`,
    },
    {
      title: '4. 컬렉션 요소는 객체만 가능',
      html: `
        <p>${I('int')}, ${I('char')}, ${I('double')} 같은 <b>기본 타입</b>은 타입 매개변수로 쓸 수 없습니다. Wrapper 클래스를 씁니다.</p>
        ${C(`
Vector<int> v = new Vector<int>();         // 컴파일 오류!
Vector<Integer> v = new Vector<Integer>(); // 정상`)}
        <div class="trap">함정: ${I('Vector<int>')}는 <b>컴파일 오류</b>입니다. 하지만 ${I('v.add(4)')}처럼 기본 타입 <b>값</b>을 넣는 건 자동 박싱 덕분에 됩니다.</div>`,
    },
    {
      title: '5. Vector<E>', prof: true,
      html: `
        <p>배열을 가변 크기로 다루게 해 주는 컬렉션 클래스입니다. ${I('java.util.Vector')}</p>
        <ul>
          <li>요소가 넘치면 길이가 자동 조절되고, 삽입, 삭제 시 자리를 자동으로 이동</li>
          <li>삽입 가능한 것: <b>객체, null</b>, 그리고 Wrapper 객체로 바뀌는 기본 타입 값</li>
          <li>맨 뒤나 중간에 삽입 가능, 임의 위치의 요소 삭제 가능</li>
        </ul>
        ${C(`
Vector<Integer> v = new Vector<Integer>();    // 기본 용량 10
Vector<Integer> v = new Vector<Integer>(5);   // 초기 용량 5
Vector<String> stringVector;
stringVector = new Vector<String>();`)}
        <h4>주요 메서드</h4>
        ${methods(listMethods, '벡터')}
        <h4>활용 흐름 (슬라이드 15~16)</h4>
        ${C(`
Vector<Integer> v = new Vector<Integer>(7);
v.add(5); v.add(4); v.add(-1);   // [5, 4, -1]
int n = v.size();       // 3
int c = v.capacity();   // 7
v.add(2, 100);          // [5, 4, 100, -1]
// v.add(5, 100);       // 오류! size()보다 큰 위치엔 삽입 불가
int i = v.get(1);       // 4
v.remove(1);            // [5, 100, -1]
// v.remove(4);         // 오류! 인덱스 4에 요소 없음
int last = v.lastElement();  // -1
v.removeAllElements();  // []`)}
        <div class="trap">함정: ${I('add(index, e)')}는 <b>0 ~ size()</b> 위치까지만 됩니다. ${I('size()')}보다 큰 인덱스는 실행 중 예외가 납니다.</div>`,
    },
    {
      title: '6. 자동 박싱 / 언박싱',
      html: `
        <p><b>JDK 1.5 이전</b>에는 직접 Wrapper로 만들고 꺼낼 때 캐스팅했습니다.</p>
        ${C(`
v.add(Integer.valueOf(4));
Integer n = (Integer)v.get(0);
int k = n.intValue();   // k = 4`)}
        <p><b>JDK 1.5부터</b>는 자동으로 변환됩니다.</p>
        ${C(`
v.add(4);          // 4 → Integer.valueOf(4) 자동 박싱
int k = v.get(0);  // Integer → int 자동 언박싱, k = 4`)}`,
    },
    {
      title: '7. 생성문의 진화: Java 7, Java 10',
      html: `
        ${C(`
Vector<Integer> v = new Vector<Integer>(); // Java 7 이전
Vector<Integer> v = new Vector<>();        // Java 7부터: <> 다이아몬드 연산자
var v = new Vector<Integer>();             // Java 10부터: var 지역 변수 타입 추론`)}
        <ul>
          <li>Java 7: 컴파일러의 <b>타입 추론</b>, ${I('<>')}(다이아몬드 연산자)에서 타입 매개변수 생략</li>
          <li>Java 10: ${I('var')} 키워드, <b>지역 변수</b> 타입 추론</li>
        </ul>`,
    },
    {
      title: '8. ArrayList<E>',
      html: `
        <p>가변 크기 배열을 구현한 클래스로, 삽입, 삭제, 검색 기능이 <b>벡터와 거의 같습니다</b>.</p>
        ${C(`ArrayList<String> al = new ArrayList<String>();`)}
        <ul>
          <li><b>차이 1</b>: 벡터와 달리 <b>스레드 동기화 기능이 없음</b>. 여러 스레드가 동시에 접근해도 동기화되지 않으므로 개발자가 직접 동기화 코드를 작성해야 함</li>
          <li><b>차이 2</b>: ${I('capacity()')} 메서드가 <b>없음</b></li>
        </ul>
        ${C(`
ArrayList<String> a = new ArrayList<String>(7);
a.add("Hello"); a.add("Hi"); a.add("Java");
int n = a.size();          // 3
// int c = a.capacity();   // 오류! capacity() 없음
a.add(2, "Sahni");         // [Hello, Hi, Sahni, Java]
String str = a.get(1);     // "Hi"
a.remove(1);               // [Hello, Sahni, Java]
a.clear();                 // []`)}
        <p>메서드는 Vector 표와 같습니다. ${I('add(int index, E element)')}, ${I('get(int index)')}, ${I('size()')} ${P}</p>`,
    },
    {
      title: '9. Iterator<E>: 순차 검색',
      html: `
        <p>Vector, ArrayList, LinkedList, <b>Set</b>의 요소를 순서대로 검색할 때 쓰는 인터페이스입니다. ${I('java.util.Iterator')}</p>
        <table class="m"><tr><th>메서드</th><th>설명</th></tr>
          <tr><td>${I('boolean hasNext()')}</td><td>다음에 쓸 요소가 있으면 true</td></tr>
          <tr><td>${I('E next()')}</td><td>다음 요소 리턴</td></tr>
          <tr><td>${I('void remove()')}</td><td>마지막으로 리턴된 요소 제거</td></tr>
        </table>
        ${C(`
Vector<Integer> v = new Vector<Integer>();
Iterator<Integer> it = v.iterator();  // 컬렉션의 iterator()로 얻음
while (it.hasNext()) {                // 모든 요소 방문
    int n = it.next();                // 다음 요소
    ...
}`)}`,
    },
    {
      title: '10. HashMap<K,V>',
      html: `
        <p><b>키(key)와 값(value)의 쌍</b>으로 된 요소를 다루는 컬렉션입니다. K는 키 타입, V는 값 타입입니다.</p>
        <ul>
          <li>삽입은 ${I('put(key, value)')}, 검색은 ${I('get(key)')}이며, 값을 찾으려면 <b>반드시 키</b>를 써야 함</li>
          <li><b>해시 함수</b>가 저장 위치를 정하므로 사용자는 위치를 알 수 없고, <b>삽입 순서와 위치는 무관</b>함</li>
          <li>Vector, ArrayList보다 <b>삽입, 삭제, 검색이 매우 빠름</b>(요소 이동이 없고, get(key) 한 번에 위치를 찾음)</li>
          <li><b>인덱스로 접근할 수 없음</b></li>
        </ul>
        <table class="m"><tr><th>메서드</th><th>설명</th></tr>
          <tr><td>${I('V put(K key, V value)')}</td><td>key와 value를 매핑해 저장</td></tr>
          <tr><td>${I('V get(Object key)')}</td><td>key에 매핑된 값, <b>없으면 null</b></td></tr>
          <tr><td>${I('V remove(Object key)')}</td><td>key와 그 값 삭제</td></tr>
          <tr><td>${I('boolean containsKey(Object key)')}</td><td>key가 있으면 true</td></tr>
          <tr><td>${I('boolean containsValue(Object value)')}</td><td>그 값에 매핑된 키가 있으면 true</td></tr>
          <tr><td>${I('Set<K> keySet()')}</td><td>모든 키를 담은 Set 리턴</td></tr>
          <tr><td>${I('boolean isEmpty()')}</td><td>비어 있으면 true</td></tr>
          <tr><td>${I('int size()')}</td><td>요소 개수</td></tr>
          <tr><td>${I('void clear()')}</td><td>모든 요소 삭제</td></tr>
        </table>
        ${C(`
HashMap<String, String> dic = new HashMap<String, String>();
dic.put("baby", "아기");
dic.put("love", "사랑");
dic.put("apple", "사과");

Set<String> keys = dic.keySet();       // 모든 키
Iterator<String> it = keys.iterator();
while (it.hasNext()) {
    String key = it.next();
    String value = dic.get(key);
    System.out.print("(" + key + "," + value + ")");
}
String kor = dic.get("babo");          // 없는 키 → null`)}`,
    },
    {
      title: '11. 제네릭 클래스 만들기',
      html: `
        <p>클래스 이름 옆에 타입 매개변수를 붙입니다.</p>
        ${C(`
public class MyClass<T> {
    T val;                  // val의 타입은 T
    void set(T a) { val = a; }
    T get() { return val; }
}

MyClass<String> s = new MyClass<String>();   // T를 String으로 구체화
s.set("hello");
System.out.println(s.get());   // hello
MyClass<Integer> n = new MyClass<Integer>(); // T를 Integer로 구체화
n.set(5);
System.out.println(n.get());   // 5`)}
        <h4>예제 7-6 제네릭 스택</h4>
        ${C(`
class GStack<T> {
    int tos;
    Object[] stck;
    public GStack() { tos = 0; stck = new Object[10]; }
    public void push(T item) {
        if (tos == 10) return;
        stck[tos] = item; tos++;
    }
    public T pop() {
        if (tos == 0) return null;
        tos--;
        return (T)stck[tos];
    }
}`)}
        <div class="tip">${I('new T[10]')}처럼 제네릭 타입 배열은 만들 수 없어서 ${I('Object[]')}로 만들고, 꺼낼 때 ${I('(T)')}로 캐스팅합니다. push seoul, busan, LA 후 pop 3번 → <b>LA, busan, seoul</b>(LIFO)</div>`,
    },
    {
      title: '12. 예제 결과 한눈에',
      html: `
        <table class="m"><tr><th>예제</th><th>핵심 / 결과</th></tr>
          <tr><td>7-1 Vector</td><td>5, 4, -1 추가 후 add(2,100) → 요소 수 4, 용량 10, 출력 5 4 100 -1, 합 108</td></tr>
          <tr><td>7-2 Point 벡터</td><td>(2,3), (-5,20), (30,-8) 추가 후 remove(1) → (2,3) (30,-8)</td></tr>
          <tr><td>7-3 ArrayList</td><td>이름 4개 입력, 가장 긴 이름 찾기 (Mike Jane Ashley Helen → Ashley)</td></tr>
          <tr><td>7-4 Iterator</td><td>7-1을 iterator()/hasNext()/next()로 수정, 합 108</td></tr>
          <tr><td>7-5 HashMap 사전</td><td>keySet()+Iterator로 전체 출력, 없는 단어는 get()이 null</td></tr>
          <tr><td>7-6 GStack</td><td>LA busan seoul / 5 3 1</td></tr>
        </table>`,
    },
  ];

  const cards = [
    { q: '인덱스 index 위치에 element를 삽입하는 메서드 (시그니처)', a: 'void add(int index, E element)', prof: true },
    { q: '인덱스 index의 요소를 리턴하는 메서드 (시그니처)', a: 'E get(int index)', prof: true },
    { q: '요소의 개수를 리턴하는 메서드 (시그니처)', a: 'int size()', prof: true },
    { q: '맨 뒤에 element를 추가하는 메서드 (시그니처)', a: 'boolean add(E element)' },
    { q: 'Vector의 현재 용량을 리턴하는 메서드', a: 'int capacity()', note: 'ArrayList에는 없음' },
    { q: 'index 위치 요소를 리턴하는 Vector 전용 메서드 (get 말고)', a: 'E elementAt(int index)' },
    { q: 'o와 같은 첫 요소의 인덱스, 없으면?', a: 'int indexOf(Object o) → 없으면 -1' },
    { q: '인덱스로 요소 삭제', a: 'E remove(int index)' },
    { q: '객체 o와 같은 첫 요소 삭제', a: 'boolean remove(Object o)' },
    { q: 'Vector의 모든 요소 삭제, 크기 0', a: 'void removeAllElements()', note: 'ArrayList는 clear()' },
    { q: '비어 있으면 true', a: 'boolean isEmpty()' },
    { q: 'Vector의 마지막 요소 얻기', a: 'lastElement()' },
    { q: 'Iterator: 다음 요소가 있으면 true', a: 'boolean hasNext()' },
    { q: 'Iterator: 다음 요소 리턴', a: 'E next()' },
    { q: 'Iterator: 마지막으로 리턴된 요소 제거', a: 'void remove()' },
    { q: '컬렉션에서 Iterator 얻는 메서드', a: 'iterator()' },
    { q: 'HashMap에 (키, 값) 저장', a: 'V put(K key, V value)' },
    { q: 'HashMap에서 키로 값 검색 (없으면?)', a: 'V get(Object key) → 없으면 null' },
    { q: 'HashMap의 모든 키를 담은 컬렉션 리턴', a: 'Set<K> keySet()' },
    { q: 'HashMap에 키가 있는지 확인', a: 'boolean containsKey(Object key)' },
    { q: '제네릭 도입 버전', a: 'JDK 1.5 (2004년)', note: 'C++ 템플릿과 같은 개념' },
    { q: '타입 매개변수에 구체적 타입을 지정해 객체를 생성하는 것', a: '구체화' },
    { q: 'Java 7에서 추가된 타입 매개변수 생략 문법', a: 'new Vector<>()  — 다이아몬드 연산자' },
    { q: 'Java 10에서 추가된 지역 변수 타입 추론 키워드', a: 'var' },
    { q: 'Vector와 ArrayList의 가장 큰 차이', a: 'ArrayList는 스레드 동기화 기능이 없음' },
    { q: 'Stack<E>의 부모 클래스', a: 'Vector<E>' },
    { q: 'new Vector<Integer>()의 기본 용량', a: '10' },
  ];

  const quiz = [
    // 교수님 강조
    { id: 'p1', prof: true, type: 'mcq', mono: true, q: '인덱스 index 위치에 element를 삽입하는 Vector/ArrayList 메서드의 올바른 시그니처는?',
      choices: ['void add(int index, E element)', 'boolean add(int index, E element)', 'void insert(int index, E element)', 'void add(E element, int index)'], answer: 0,
      explain: '중간 삽입 add는 리턴 타입이 void이고 (int index, E element) 순서입니다. 맨 뒤 추가 add(E)만 boolean입니다.' },
    { id: 'p2', prof: true, type: 'mcq', mono: true, q: '인덱스 index의 요소를 리턴하는 메서드의 올바른 시그니처는?',
      choices: ['E get(int index)', 'int get(int index)', 'Object get(E element)', 'void get(int index)'], answer: 0,
      explain: '리턴 타입은 타입 매개변수 E입니다. Vector<Integer>라면 Integer가 리턴됩니다.' },
    { id: 'p3', prof: true, type: 'mcq', mono: true, q: '컬렉션에 들어 있는 요소의 개수를 리턴하는 메서드는?',
      choices: ['int size()', 'int length()', 'int capacity()', 'int count()'], answer: 0,
      explain: 'size()는 요소 개수, capacity()는 용량(Vector만)입니다. length는 배열/문자열용입니다.' },
    { id: 'p4', prof: true, type: 'mcq', q: 'add(int index, E element)의 리턴 타입은?',
      choices: ['void', 'boolean', 'E', 'int'], answer: 0,
      explain: 'void add(int index, E element). 반면 add(E element)는 boolean을 리턴합니다.' },
    { id: 'p5', prof: true, type: 'blank', q: '벡터 전체를 출력하는 반복문의 빈칸은?',
      code: 'for(int i=0; i<v.____(); i++)\n    System.out.println(v.get(i));',
      choices: ['size', 'length', 'capacity', 'count'], answer: 0,
      explain: '요소 개수는 size()입니다. capacity()를 쓰면 빈 칸까지 접근해서 오류가 납니다.' },
    { id: 'p6', prof: true, type: 'blank', q: '[5, 4, -1]의 4와 -1 사이에 100을 넣는 코드의 빈칸은?',
      code: 'v.____(2, 100);',
      choices: ['add', 'insert', 'put', 'set'], answer: 0,
      explain: 'void add(int index, E element). 인덱스 2에 삽입되고 -1은 뒤로 밀립니다.' },
    { id: 'p7', prof: true, type: 'blank', q: 'i번째 정수를 꺼내는 코드의 빈칸은? (교과서 표준 메서드)',
      code: 'int n = v.____(i);',
      choices: ['get', 'put', 'next', 'remove'], answer: 0,
      explain: 'E get(int index). Integer가 int로 자동 언박싱됩니다. elementAt(i)도 같은 기능입니다.' },
    { id: 'p8', prof: true, type: 'output', q: '출력 결과는?',
      code: 'Vector<String> v = new Vector<String>();\nv.add("A"); v.add("B");\nv.add(1, "C");\nSystem.out.println(v.get(1) + v.size());',
      choices: ['C3', 'B3', 'C2', 'A3'], answer: 0,
      explain: 'add(1,"C") 후 [A, C, B]. get(1)은 "C", size()는 3이므로 "C3"입니다.' },

    // OX
    { id: 'o1', type: 'ox', q: '컬렉션의 요소로 int, double 같은 기본 타입을 타입 매개변수로 직접 사용할 수 있다.',
      choices: ['O', 'X'], answer: 1, explain: '요소는 객체만 가능합니다. Vector<int>는 컴파일 오류이고 Vector<Integer>를 써야 합니다.' },
    { id: 'o2', type: 'ox', q: 'Vector<Integer> v = new Vector<Integer>(); v.add(4); 는 정상 동작한다.',
      choices: ['O', 'X'], answer: 0, explain: 'JDK 1.5부터 자동 박싱으로 4가 Integer.valueOf(4)로 변환됩니다.' },
    { id: 'o3', type: 'ox', q: 'ArrayList는 Vector와 달리 스레드 동기화 기능이 없다.',
      choices: ['O', 'X'], answer: 0, explain: '여러 스레드가 동시에 접근하면 개발자가 직접 동기화 코드를 작성해야 합니다.' },
    { id: 'o4', type: 'ox', q: 'HashMap은 인덱스를 이용해 요소에 접근할 수 있다.',
      choices: ['O', 'X'], answer: 1, explain: '해시맵은 오직 키로만 검색합니다.' },
    { id: 'o5', type: 'ox', q: 'HashMap에 삽입한 순서대로 요소의 저장 위치가 정해진다.',
      choices: ['O', 'X'], answer: 1, explain: '해시 함수가 위치를 결정하므로 삽입 순서와 위치는 관계가 없습니다.' },
    { id: 'o6', type: 'ox', q: '제네릭은 JDK 1.5부터 도입되었다.',
      choices: ['O', 'X'], answer: 0, explain: '2004년 JDK 1.5부터입니다. C++의 템플릿과 같은 개념입니다.' },
    { id: 'o7', type: 'ox', q: 'ArrayList에도 capacity() 메서드가 있다.',
      choices: ['O', 'X'], answer: 1, explain: 'capacity()는 Vector에만 있습니다. ArrayList에서 호출하면 컴파일 오류입니다.' },
    { id: 'o8', type: 'ox', q: 'Iterator로 Set에 저장된 요소도 순차 검색할 수 있다.',
      choices: ['O', 'X'], answer: 0, explain: 'Vector, ArrayList, LinkedList, Set의 요소를 순차 검색할 수 있습니다.' },
    { id: 'o9', type: 'ox', q: 'Vector에는 null도 삽입할 수 있다.',
      choices: ['O', 'X'], answer: 0, explain: 'Vector에 삽입 가능한 것은 객체와 null입니다.' },
    { id: 'o10', type: 'ox', q: 'Map<K,V>는 Collection<E> 인터페이스를 상속한다.',
      choices: ['O', 'X'], answer: 1, explain: 'Map은 Collection과 별개의 계층입니다.' },
    { id: 'o11', type: 'ox', q: 'Vector v = new Vector(); 처럼 타입 매개변수 없이 쓰면 컴파일 오류가 난다.',
      choices: ['O', 'X'], answer: 1, explain: '오류가 아니라 경고(raw type)가 납니다. 타입 매개변수를 쓰는 것이 바람직합니다.' },

    // 객관식
    { id: 'm1', type: 'mcq', mono: true, q: 'Java 7부터 가능한 생성문은?',
      choices: ['Vector<Integer> v = new Vector<>();', 'Vector<> v = new Vector<Integer>();', 'var v = new Vector<>(Integer);', 'Vector v<Integer> = new Vector();'], answer: 0,
      explain: 'Java 7의 다이아몬드 연산자 <>는 오른쪽의 타입 매개변수를 생략합니다.' },
    { id: 'm2', type: 'mcq', mono: true, q: 'Java 10부터 가능한 생성문은?',
      choices: ['var v = new Vector<Integer>();', 'auto v = new Vector<Integer>();', 'let v = new Vector<Integer>();', 'Vector v = var<Integer>();'], answer: 0,
      explain: 'Java 10의 var 키워드로 지역 변수 타입을 추론합니다.' },
    { id: 'm3', type: 'mcq', q: 'HashMap에 (키, 값) 쌍을 저장하는 메서드는?',
      choices: ['put(key, value)', 'add(key, value)', 'insert(key, value)', 'set(key, value)'], answer: 0,
      explain: '삽입은 put(key, value), 검색은 get(key)입니다.' },
    { id: 'm4', type: 'mcq', q: 'HashMap의 get(key)에서 key가 없으면 무엇이 리턴되나?',
      choices: ['null', '-1', '빈 문자열 ""', '예외 발생'], answer: 0,
      explain: '매핑된 값이 없으면 null을 리턴합니다. -1은 indexOf()가 못 찾았을 때입니다.' },
    { id: 'm5', type: 'mcq', q: 'HashMap의 모든 키를 얻는 메서드와 그 리턴 타입은?',
      choices: ['keySet() → Set<K>', 'keys() → List<K>', 'getKeys() → K[]', 'keySet() → Vector<K>'], answer: 0,
      explain: 'Set<K> keySet(). 예제 7-5에서 이 Set의 iterator()로 전체를 출력합니다.' },
    { id: 'm6', type: 'mcq', q: 'Iterator<E>의 메서드가 아닌 것은?',
      choices: ['previous()', 'hasNext()', 'next()', 'remove()'], answer: 0,
      explain: 'Iterator의 메서드는 hasNext(), next(), remove() 3개입니다.' },
    { id: 'm7', type: 'mcq', q: 'List<E> 인터페이스를 구현한 클래스가 아닌 것은?',
      choices: ['HashSet<E>', 'ArrayList<E>', 'Vector<E>', 'LinkedList<E>'], answer: 0,
      explain: 'HashSet은 Set<E>을 구현합니다.' },
    { id: 'm8', type: 'mcq', q: 'Stack<E> 클래스가 상속받는 클래스는?',
      choices: ['Vector<E>', 'ArrayList<E>', 'LinkedList<E>', 'HashMap<K,V>'], answer: 0,
      explain: 'java.util.Stack<E>는 Vector<E>를 상속합니다.' },
    { id: 'm9', type: 'mcq', q: '컬렉션의 특징이 아닌 것은?',
      choices: ['한 번 정한 크기가 고정된다', '요소 개수에 따라 크기가 자동 조절된다', '삽입, 삭제 시 요소 위치가 자동 이동된다', '객체의 삽입, 삭제, 검색이 쉽다'], answer: 0,
      explain: '고정 크기는 배열의 특징입니다. 컬렉션은 이 단점을 개선한 가변 크기 컨테이너입니다.' },
    { id: 'm10', type: 'mcq', q: '제네릭 타입에 구체적인 타입을 지정해 객체를 생성하는 것을 무엇이라 하나?',
      choices: ['구체화', '일반화', '추상화', '캡슐화'], answer: 0,
      explain: '예: MyClass<String>은 T를 String으로 구체화한 것입니다.' },
    { id: 'm11', type: 'mcq', mono: true, q: 'JDK 1.5 이전 방식으로 벡터의 첫 요소를 int로 꺼내는 코드는?',
      choices: ['Integer n = (Integer)v.get(0);\nint k = n.intValue();', 'int k = v.get(0);', 'int k = (int)v.get(0).value;', 'int k = Integer.valueOf(v.get(0));'], answer: 0,
      explain: '자동 언박싱이 없던 시절에는 Wrapper로 캐스팅한 뒤 intValue()로 꺼냈습니다.' },
    { id: 'm12', type: 'mcq', q: 'HashMap이 Vector, ArrayList보다 삽입, 삭제가 빠른 이유는?',
      choices: ['요소의 위치 이동이 필요 없어서', '인덱스로 접근해서', '크기가 고정이라서', '요소를 정렬해 두어서'], answer: 0,
      explain: '해시 함수가 위치를 정하므로 삽입, 삭제 때 다른 요소를 옮길 필요가 없습니다.' },
    { id: 'm13', type: 'mcq', q: '제네릭과 같은 개념인 C++의 기능은?',
      choices: ['템플릿(template)', '포인터', '연산자 중복', '다중 상속'], answer: 0,
      explain: '제네릭은 C++의 템플릿과 같은 개념입니다.' },

    // 출력 예측
    { id: 'u1', type: 'output', q: '출력 결과는? (예제 7-1 변형)',
      code: 'Vector<Integer> v = new Vector<Integer>();\nv.add(5); v.add(4); v.add(-1);\nv.add(2, 100);\nSystem.out.println(v.size() + " " + v.capacity());',
      choices: ['4 10', '4 4', '3 10', '4 7'], answer: 0,
      explain: '요소는 4개이고, 기본 생성자의 용량은 10입니다.' },
    { id: 'u2', type: 'output', q: '모든 요소를 차례로 출력하면?',
      code: 'Vector<Integer> v = new Vector<Integer>();\nv.add(5); v.add(4); v.add(-1);\nv.add(2, 100);',
      choices: ['5 4 100 -1', '5 100 4 -1', '5 4 -1 100', '100 5 4 -1'], answer: 0,
      explain: '인덱스 2(-1 자리)에 100이 들어가고 -1은 뒤로 밀립니다.' },
    { id: 'u3', type: 'output', q: '출력 결과는?',
      code: 'Vector<Integer> v = new Vector<Integer>(7);\nv.add(5); v.add(4); v.add(-1);\nSystem.out.println(v.size() + " " + v.capacity());',
      choices: ['3 7', '3 10', '7 7', '3 3'], answer: 0,
      explain: '생성자 인자 7은 초기 용량입니다. 요소는 3개입니다.' },
    { id: 'u4', type: 'output', q: '출력 결과는? (예제 7-2)',
      code: 'v.add(new Point(2, 3));\nv.add(new Point(-5, 20));\nv.add(new Point(30, -8));\nv.remove(1);\nfor(int i=0; i<v.size(); i++)\n    System.out.println(v.get(i));',
      choices: ['(2,3)\n(30,-8)', '(-5,20)\n(30,-8)', '(2,3)\n(-5,20)', '(2,3)\n(-5,20)\n(30,-8)'], answer: 0,
      explain: 'remove(1)은 인덱스 1의 Point(-5,20)을 삭제합니다. 출력은 toString()이 호출된 결과입니다.' },
    { id: 'u5', type: 'output', q: '모든 요소를 출력하면?',
      code: 'ArrayList<String> a = new ArrayList<String>();\na.add("Hello"); a.add("Hi"); a.add("Java");\na.add(2, "Sahni");\na.remove(1);',
      choices: ['Hello Sahni Java', 'Hello Hi Java', 'Hello Hi Sahni', 'Sahni Hi Java'], answer: 0,
      explain: 'add(2,"Sahni") → [Hello, Hi, Sahni, Java], remove(1) → [Hello, Sahni, Java]' },
    { id: 'u6', type: 'output', q: '출력 결과는? (예제 7-6)',
      code: 'GStack<String> s = new GStack<String>();\ns.push("seoul"); s.push("busan"); s.push("LA");\nfor(int n=0; n<3; n++)\n    System.out.print(s.pop() + " ");',
      choices: ['LA busan seoul', 'seoul busan LA', 'LA seoul busan', 'busan LA seoul'], answer: 0,
      explain: '스택은 나중에 넣은 것이 먼저 나옵니다(LIFO).' },
    { id: 'u7', type: 'output', q: '출력 결과는?',
      code: 'HashMap<String,String> h = new HashMap<String,String>();\nh.put("baby", "아기");\nh.put("love", "사랑");\nh.put("apple", "사과");\nh.remove("apple");\nSystem.out.println(h.size());',
      choices: ['2', '3', '1', '0'], answer: 0,
      explain: 'remove("apple")로 키와 값이 함께 삭제되어 2개가 남습니다.' },
    { id: 'u8', type: 'output', q: '입력이 babo일 때 출력은? (예제 7-5)',
      code: 'String kor = dic.get(eng);\nif(kor == null)\n    System.out.println(eng + "는 없는 단어 입니다.");\nelse\n    System.out.println(kor);',
      choices: ['babo는 없는 단어 입니다.', 'null', '바보', '예외 발생'], answer: 0,
      explain: '없는 키를 get()하면 null이 리턴되어 if문으로 갑니다.' },
    { id: 'u9', type: 'output', q: '출력 결과는?',
      code: 'Vector<Integer> v = new Vector<Integer>();\nv.add(5); v.add(4); v.add(100); v.add(-1);\nSystem.out.println(v.indexOf(100) + " " + v.indexOf(7));',
      choices: ['2 -1', '3 -1', '2 null', '2 0'], answer: 0,
      explain: 'indexOf는 첫 인덱스를 리턴하고, 없으면 -1입니다.' },
    { id: 'u10', type: 'output', q: 'last의 값은?',
      code: 'Vector<Integer> v = new Vector<Integer>();\nv.add(5); v.add(4); v.add(100); v.add(-1);\nv.remove(1);\nint last = v.lastElement();',
      choices: ['-1', '100', '4', '5'], answer: 0,
      explain: 'remove(1) 후 [5, 100, -1]이므로 마지막 요소는 -1입니다.' },
    { id: 'u11', type: 'output', q: '출력 결과는? (예제 7-4)',
      code: 'Vector<Integer> v = new Vector<Integer>();\nv.add(5); v.add(4); v.add(-1); v.add(2, 100);\nint sum = 0;\nIterator<Integer> it = v.iterator();\nwhile(it.hasNext())\n    sum += it.next();\nSystem.out.println(sum);',
      choices: ['108', '8', '100', '109'], answer: 0,
      explain: '5 + 4 + 100 + (-1) = 108' },
    { id: 'u12', type: 'output', q: '출력 결과는?',
      code: 'MyClass<Integer> n = new MyClass<Integer>();\nn.set(5);\nSystem.out.println(n.get() + 1);',
      choices: ['6', '51', '5', '컴파일 오류'], answer: 0,
      explain: 'T가 Integer로 구체화되어 get()이 Integer를 리턴하고, 자동 언박싱되어 5 + 1 = 6입니다.' },

    // 오류 찾기
    { id: 'e1', type: 'error', mono: true, q: '컴파일 오류가 나는 문장은?',
      choices: ['Vector<int> v = new Vector<int>();', 'Vector<Integer> v = new Vector<Integer>();', 'Vector<Integer> v = new Vector<>();', 'var v = new Vector<Integer>();'], answer: 0,
      explain: '타입 매개변수를 기본 타입으로 구체화할 수 없습니다.' },
    { id: 'e2', type: 'error', mono: true, q: 'v = [5, 4, 100, -1]일 때 실행 중 오류가 나는 것은?',
      choices: ['v.add(5, 100);', 'v.add(4, 100);', 'v.add(0, 100);', 'v.add(100);'], answer: 0,
      explain: 'size()가 4이므로 인덱스 0~4까지만 삽입할 수 있습니다. 5는 size()보다 커서 오류입니다.' },
    { id: 'e3', type: 'error', mono: true, q: 'ArrayList<String> a에서 오류가 나는 것은?',
      choices: ['int c = a.capacity();', 'int n = a.size();', 'a.add(0, "Hi");', 'a.clear();'], answer: 0,
      explain: 'ArrayList에는 capacity() 메서드가 없습니다.' },
    { id: 'e4', type: 'error', mono: true, q: 'v = [5, 100, -1]일 때 오류가 나는 것은?',
      choices: ['v.remove(4);', 'v.remove(2);', 'v.remove(0);', 'v.removeAllElements();'], answer: 0,
      explain: '인덱스 4에는 요소가 없으므로 오류입니다(유효 인덱스 0~2).' },

    // 빈칸
    { id: 'b1', type: 'blank', q: 'Iterator를 얻는 코드의 빈칸은?',
      code: 'Iterator<Integer> it = v.________();', choices: ['iterator', 'getIterator', 'next', 'keySet'], answer: 0,
      explain: '컬렉션의 iterator() 메서드가 Iterator 객체를 리턴합니다.' },
    { id: 'b2', type: 'blank', q: '모든 요소를 방문하는 while 조건의 빈칸은?',
      code: 'while( it.________() ) {\n    int n = it.next();\n}', choices: ['hasNext', 'next', 'isEmpty', 'contains'], answer: 0,
      explain: 'hasNext()는 다음 요소가 있으면 true입니다.' },
    { id: 'b3', type: 'blank', q: '해시맵의 모든 키를 얻는 코드의 빈칸은? (예제 7-5)',
      code: 'Set<String> keys = dic.________();', choices: ['keySet', 'keys', 'values', 'iterator'], answer: 0,
      explain: 'Set<K> keySet()은 모든 키를 담은 Set을 리턴합니다.' },
    { id: 'b4', type: 'blank', q: '제네릭 클래스 선언으로 올바른 것은?',
      code: '________ {\n    T val;\n    void set(T a) { val = a; }\n    T get() { return val; }\n}',
      choices: ['public class MyClass<T>', 'public class<T> MyClass', 'public class MyClass(T)', 'public generic class MyClass'], answer: 0,
      explain: '클래스 이름 옆에 타입 매개변수 <T>를 붙입니다.' },
    { id: 'b5', type: 'blank', q: 'GStack의 pop() 마지막 줄 빈칸은?',
      code: 'public T pop() {\n    if(tos == 0) return null;\n    tos--;\n    return ____stck[tos];\n}', choices: ['(T)', '(Object)', '(E)', 'new T'], answer: 0,
      explain: 'stck는 Object 배열이므로 T로 캐스팅해서 리턴합니다.' },
    { id: 'b6', type: 'blank', q: '해시맵에서 키로 값을 얻는 코드의 빈칸은?',
      code: 'String value = dic.____(key);', choices: ['get', 'put', 'find', 'getValue'], answer: 0,
      explain: 'V get(Object key)입니다.' },
  ];

  window.CHAPTER_DATA = window.CHAPTER_DATA || {};
  window.CHAPTER_DATA['07'] = { sections, cards, quiz };
})();
