(function () {
  const E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const I = s => `<code>${E(s)}</code>`;
  // «…» 로 감싼 부분은 PPT에서 진한(색) 글씨였던 곳
  const C = s => `<pre><code>${E(s.trim()).replace(/«(.*?)»/g, '<b class="pb">$1</b>')}</code></pre>`;
  const P = '{{PROF}}';
  const table = (head, rows) => `<table class="m"><tr>${head.map(h => `<th>${E(h)}</th>`).join('')}</tr>${rows.map(r =>
    `<tr class="${r.hl ? 'hl' : ''}">${r.cells.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;

  const sections = [
    {
      id: 'range', title: '0. 9장 시험 범위 (녹음 안내)', open: true,
      html: `
        <ul>
          <li><b>1~34쪽</b>까지만 출제 (MouseAdapter 예제 9-5까지). 뒤의 <b>Key 이벤트는 범위 밖</b></li>
          <li>교수님 메모: <b>ActionEvent</b>, <b>innerClass(내부 클래스)</b>, <b>anonymous class(익명 클래스)</b> ${P}</li>
          <li>수업 중 내부 클래스 → 익명 클래스로 바꾸는 실습을 직접 함. "익명은 한두 번 더 나올 거… 이런 코드를 보고 <b>당황하면 안 된다</b>"</li>
          <li>형식: 긴 코드에 구멍 뚫는 빈칸, 단답형, 객관식. 코드 전체 작성은 없음</li>
        </ul>
        <p class="legend">코드 속 <b class="pb">주황 굵은 글씨</b> = PPT에서 진한(빨강·보라) 글씨였던 부분. 코드 빈칸 문제도 이 부분을 뚫었습니다.</p>`,
    },
    {
      id: 'edp', title: '1. 이벤트 기반 프로그래밍 (3~6쪽)',
      html: `
        <ul>
          <li><b>이벤트 기반 프로그래밍(Event Driven Programming)</b>: 이벤트의 발생에 의해 프로그램 흐름이 결정되는 방식</li>
          <li>이벤트가 발생하면 이벤트를 처리하는 루틴(<b>이벤트 리스너</b>) 실행. 어떤 코드가 언제 실행될지 이벤트 발생에 의해 결정</li>
          <li>이벤트 종류: 사용자 입력(마우스 드래그·클릭, 키보드), 센서·네트워크 입력, 다른 프로그램·스레드의 메시지</li>
          <li>반대 개념: <b>배치 실행(batch programming)</b>, 개발자가 프로그램 흐름을 결정</li>
          <li>GUI 응용프로그램은 이벤트 기반으로 작성됨 (MFC, C# GUI, Android, 자바의 AWT·Swing 등)</li>
        </ul>
        <h4>이벤트가 처리되는 과정 (6쪽)</h4>
        <ol>
          <li><b>이벤트 발생</b> (마우스 클릭, 키보드 입력)</li>
          <li><b>이벤트 객체 생성</b> (발생한 이벤트 정보를 가진 객체)</li>
          <li>응용프로그램에 작성된 <b>이벤트 리스너 찾기</b></li>
          <li><b>이벤트 리스너 실행</b> (리스너에 이벤트 객체 전달 → 리스너 코드 실행)</li>
        </ol>`,
    },
    {
      id: 'terms', title: '2. 이벤트 관련 용어 (7~8쪽)', prof: true,
      html: `
        ${table(['용어', '뜻'], [
          { cells: ['<b>이벤트 소스</b>', '이벤트를 발생시킨 GUI 컴포넌트 (예: JButton)'], hl: true },
          { cells: ['<b>이벤트 객체</b>', '발생한 이벤트에 대한 정보를 가진 객체 (이벤트 종류, 소스, 화면 좌표, 마우스 버튼 종류, 눌러진 키)'], hl: true },
          { cells: ['<b>이벤트 리스너</b>', '이벤트를 처리하는 코드, 클래스로 작성. <b>컴포넌트에 등록되어야 작동</b>'], hl: true },
          { cells: ['<b>이벤트 분배 스레드</b>', 'JVM으로부터 이벤트 발생을 통지받아 소스·종류 결정 → 이벤트 객체 생성, 리스너를 찾아 호출. <b>무한 루프</b>를 실행하는 스레드'] },
        ])}
        <div class="tip">7쪽 그림: New 버튼(JButton)을 마우스로 클릭 → JVM → 이벤트 분배 스레드가 <b>ActionEvent</b> 생성 → 이벤트 리스너 호출. 이때 이벤트는 Action 이벤트, 이벤트 소스는 JButton, 이벤트 객체는 ActionEvent.</div>`,
    },
    {
      id: 'evobj', title: '3. 이벤트 객체와 getSource() (9~14쪽)', prof: true,
      html: `
        <ul>
          <li>이벤트가 발생할 때 발생한 이벤트에 관한 정보를 저장하는 객체. 이벤트 리스너에 전달됨</li>
          <li>모든 이벤트 객체는 <b>${I('java.util.EventObject')}</b>를 상속받음</li>
        </ul>
        ${C(`
import java.awt.event.*;    // 이벤트 처리가 필요한 모든 소스에 포함
import javax.swing.event.*; // 스윙 이벤트를 다루는 경우에 추가`)}
        <p>계층: EventObject → AWTEvent → ActionEvent, ItemEvent, ComponentEvent → InputEvent → <b>MouseEvent</b>, KeyEvent</p>
        <h4>이벤트 소스 알아내기: getSource() ${P}</h4>
        <ul>
          <li>${I('Object getSource()')}: EventObject의 메소드. 발생한 이벤트의 소스 컴포넌트 리턴. 모든 이벤트 객체에 적용</li>
          <li><b>Object 타입으로 리턴하므로 다운 캐스팅</b>하여 사용</li>
        </ul>
        ${C(`
Object obj = event.getSource();
JButton b = «(JButton)»event.«getSource()»;   // 실제 사용 예`)}
        <h4>이벤트 객체의 메소드 (13쪽)</h4>
        ${table(['이벤트 객체', '메소드'], [
          { cells: [I('EventObject'), I('Object getSource()')], hl: true },
          { cells: [I('ActionEvent'), I('String getActionCommand()') + ' 액션 문자열'], hl: true },
          { cells: [I('ItemEvent'), I('Object getItem()') + ', ' + I('int getStateChange()') + ' 체크 상태'] },
          { cells: [I('InputEvent'), I('int getModifiers()')] },
          { cells: [I('MouseEvent'), I('getButton() getClickCount() getPoint() getX() getY()')] },
          { cells: [I('KeyEvent'), I('getKeyChar() getKeyCode() getKeyText()') + ' (범위 밖)'] },
        ])}
        <h4>이벤트 객체와 이벤트 소스 (14쪽)</h4>
        ${table(['이벤트 객체', '이벤트 소스', '발생하는 경우'], [
          { cells: ['<b>ActionEvent</b>', 'JButton<br>JMenuItem<br>JTextField<br>JComboBox', '마우스나 &lt;Enter&gt;로 버튼 선택<br>메뉴 아이템 선택<br>텍스트 입력 중 &lt;Enter&gt;<br>아이템 선택'], hl: true },
          { cells: ['ItemEvent', 'JCheckBox, JRadioButton, JCheckBoxMenuItem', '체크박스·라디오버튼 선택 상태 변경'] },
          { cells: ['ListSelectionEvent', 'JList', '리스트에서 선택된 아이템 변경'] },
          { cells: ['MouseEvent', 'Component', '마우스 버튼 누름·뗌·클릭, 올라감·내려감, 드래그, 움직임'] },
          { cells: ['KeyEvent / FocusEvent', 'Component', '키 누름·뗌 / 포커스 받거나 잃음'] },
          { cells: ['WindowEvent', 'Window', '윈도우 활성화, 아이콘화, 열기, 닫기 등'] },
          { cells: ['AdjustmentEvent', 'JScrollBar', '스크롤바를 움직일 때'] },
          { cells: ['ComponentEvent / ContainerEvent', 'Component / Container', '사라짐·나타남·이동·크기 변경 / 컴포넌트 추가·삭제'] },
        ])}`,
    },
    {
      id: 'listener', title: '4. 이벤트 리스너 인터페이스 (15~18쪽)',
      html: `
        <ul>
          <li>이벤트 리스너: 이벤트를 처리하는 코드, <b>클래스로 작성</b></li>
          <li>JDK는 리스너 작성을 위한 다양한 <b>인터페이스</b> 제공 (${I('java.awt.event.*')})</li>
          <li>사용자 리스너 작성: 리스너 인터페이스를 상속받아(<b>implements</b>) <b>모든 추상 메소드 구현</b></li>
        </ul>
        ${C(`
interface «ActionListener» {   // 아래 메소드를 개발자가 구현해야 함
    public void «actionPerformed(ActionEvent e)»;  // Action 이벤트 발생 시 호출
}
interface «MouseListener» {    // 아래 5개 메소드를 개발자가 구현해야 함
    public void mousePressed(MouseEvent e);   // 마우스 버튼이 눌러지는 순간
    public void mouseReleased(MouseEvent e);  // 눌러진 버튼이 떼어지는 순간
    public void mouseClicked(MouseEvent e);   // 마우스가 클릭되는 순간
    public void mouseEntered(MouseEvent e);   // 컴포넌트 위에 올라가는 순간
    public void mouseExited(MouseEvent e);    // 컴포넌트 위에서 내려오는 순간
}`)}
        ${table(['이벤트', '리스너 인터페이스', '추상 메소드'], [
          { cells: ['Action', I('ActionListener'), I('actionPerformed(ActionEvent)')], hl: true },
          { cells: ['Item', I('ItemListener'), I('itemStateChanged(ItemEvent)')] },
          { cells: ['Key', I('KeyListener'), I('keyPressed / keyReleased / keyTyped')] },
          { cells: ['Mouse', I('MouseListener'), I('mousePressed / mouseReleased / mouseClicked / mouseEntered / mouseExited')], hl: true },
          { cells: ['Mouse', I('MouseMotionListener'), I('mouseDragged / mouseMoved')] },
          { cells: ['Focus', I('FocusListener'), I('focusGained / focusLost')] },
          { cells: ['ListSelection', I('ListSelectionListener'), I('valueChanged')] },
          { cells: ['Window', I('WindowListener'), 'windowOpened / Closing / Iconified / Deiconified / Closed / Activated / Deactivated (7개)'] },
          { cells: ['Adjustment', I('AdjustmentListener'), I('adjustmentValueChanged')] },
          { cells: ['Component', I('ComponentListener'), I('componentHidden / Shown / Resized / Moved')] },
          { cells: ['Container', I('ContainerListener'), I('componentAdded / componentRemoved')] },
        ])}
        <div class="trap">함정: ${I('mouseDragged')}, ${I('mouseMoved')}는 MouseListener가 아니라 <b>MouseMotionListener</b>의 메소드입니다.</div>`,
    },
    {
      id: 'steps', title: '5. 리스너 작성 과정 3단계와 등록 (19~21쪽)', prof: true,
      html: `
        <ol>
          <li><b>이벤트와 이벤트 리스너 선택</b>: 버튼 클릭 → 이벤트: Action 이벤트(ActionEvent), 리스너: ActionListener</li>
          <li><b>이벤트 리스너 클래스 작성</b>: ActionListener 인터페이스 구현</li>
          <li><b>이벤트 리스너 등록</b>: 이벤트를 받아 처리하고자 하는 컴포넌트에 등록. ${I('component.addXXXListener(listener)')} (xxx: 이벤트 명, listener: 리스너 객체)</li>
        </ol>
        ${C(`
«class MyActionListener implements ActionListener» {
    «public void actionPerformed(ActionEvent e)» {  // 버튼이 클릭될 때 호출되는 메소드
        JButton b = (JButton)e.getSource();       // 사용자가 클릭한 버튼 알아내기
        if(b.getText().equals("Action"))          // 버튼의 문자열이 "Action"인지 비교
            b.setText("액션");                     // JButton의 setText() 호출. 문자열 변경
        else
            b.setText("Action");
    }
}

JButton btn = new JButton("버튼");
«MyActionListener listener = new MyActionListener();»
«btn.addActionListener(listener);»               // 리스너 등록`)}
        <h4>Tip: 등록 메소드가 addXXXListener인 이유 (21쪽)</h4>
        <ul>
          <li>컴포넌트는 <b>서로 다른 이벤트</b>에 대한 리스너들을 동시에 가질 수 있다<br>${I('addActionListener(...)')}, ${I('addKeyListener(...)')}, ${I('addFocusListener(...)')}</li>
          <li>한 이벤트에 대해 <b>여러 개의 리스너</b>를 동시에 가질 수 있다. 이때 리스너는 <b>등록된 반대 순서로 모두 실행</b>된다</li>
        </ul>`,
    },
    {
      id: 'how', title: '6. 리스너 작성 방법 3가지 (22쪽)', prof: true,
      html: `
        ${table(['방법', '특징', '적합한 경우'], [
          { cells: ['<b>독립 클래스</b>', '이벤트 리스너를 완전한 클래스로 작성', '리스너를 <b>여러 곳에서 사용</b>할 때'] },
          { cells: ['<b>내부 클래스</b>(inner class)', '클래스 안에 멤버처럼 클래스 작성', '리스너를 <b>특정 클래스에서만 사용</b>할 때'], hl: true },
          { cells: ['<b>익명 클래스</b>(anonymous class)', '클래스의 이름 없이 간단히 리스너 작성', '클래스조차 만들 필요 없이 <b>리스너 코드가 간단</b>한 경우'], hl: true },
        ])}
        <div class="tip">세 방법 모두 리스너가 하는 일은 같고, <b>클래스를 어디에 어떻게 쓰느냐</b>만 다릅니다. 예제 9-1(독립), 9-2(내부), 9-3(익명)은 같은 버튼 프로그램입니다.</div>`,
    },
    {
      id: 'indep', title: '7. 예제 9-1 독립 클래스로 Action 리스너 (23쪽)',
      html: `
        <p>Action 버튼을 클릭하면 "액션"으로, 다시 클릭하면 "Action"으로 바뀐다.</p>
        ${C(`
import javax.swing.*;
import java.awt.event.*;
import java.awt.*;

public class IndepClassListenerEx extends JFrame {
    public IndepClassListenerEx() {
        setTitle("Action 이벤트 리스너 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        «btn.addActionListener(new MyActionListener());» // Action 리스너 달기
        c.add(btn);
        setSize(350, 150);
        setVisible(true);
    }
    public static void main(String [] args) {
        new IndepClassListenerEx();
    }
}
// MyActionListener.java 파일로 따로 작성해도 됨
«class MyActionListener implements ActionListener {»
    «public void actionPerformed(ActionEvent e) {»
        «JButton b = (JButton)e.getSource();»
        «if(b.getText().equals("Action"))»
            «b.setText("액션");»
        «else»
            «b.setText("Action");»
    «}»
«}»`)}`,
    },
    {
      id: 'inner', title: '8. 예제 9-2 내부 클래스로 Action 리스너 (24쪽)', prof: true,
      html: `
        <ul>
          <li>Action 리스너를 <b>내부 클래스</b>로 작성 (InnerClassListenerEx 클래스 안에 멤버처럼)</li>
          <li><b>private</b>으로 선언하여 InnerClassListenerEx 외부에서 사용할 수 없게 함</li>
          <li>리스너에서 바깥 클래스(InnerClassListenerEx)의 <b>멤버에 대한 접근 용이</b> → 버튼 문자열을 타이틀에 출력</li>
        </ul>
        ${C(`
import javax.swing.*;
import java.awt.event.*;
import java.awt.*;

public class InnerClassListenerEx extends JFrame {
    public InnerClassListenerEx() {
        setTitle("Action 이벤트 리스너 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        «btn.addActionListener(new MyActionListener());»
        c.add(btn);
        setSize(350, 150);
        setVisible(true);
    }
    «private class MyActionListener implements ActionListener {»
        «public void actionPerformed(ActionEvent e) {»
            «JButton b = (JButton)e.getSource();»
            «if(b.getText().equals("Action"))»
                «b.setText("액션");»
            «else»
                «b.setText("Action");»
            «InnerClassListenerEx.this.setTitle(b.getText());»
        «}»
    «}»
    public static void main(String [] args) {
        new InnerClassListenerEx();
    }
}`)}
        <div class="trap">주의: 슬라이드에는 ${I('InnerClassListener.this.setTitle(...)')}로 적혀 있지만 클래스 이름이 ${I('InnerClassListenerEx')}라서 그대로 쓰면 컴파일 오류입니다(javac로 확인). <b>바깥클래스이름.this</b> = 바깥 클래스 객체. 그냥 ${I('setTitle(b.getText());')}로 써도 됩니다.</div>`,
    },
    {
      id: 'anon', title: '9. 익명 클래스로 리스너 작성 (25~27쪽)', prof: true,
      html: `
        <ul>
          <li><b>익명 클래스(anonymous class)</b>: <b>이름이 없는</b> 클래스</li>
          <li>(<b>클래스 정의 + 인스턴스 생성</b>)을 한번에 작성</li>
          <li>코드가 짧고, <b>한 번만 사용</b>하는 경우에 이용</li>
        </ul>
        ${C(`
«new 익명클래스의수퍼클래스이름(생성자의 인자들) {»
    ......
    멤버 구현
    ......
«};»`)}
        <h4>이름 있는 클래스 → 익명 클래스 (26쪽)</h4>
        ${C(`
// (a) 이름을 가진 클래스를 작성하고 인스턴스 생성
class MyActionListener implements ActionListener {
    public void actionPerformed(ActionEvent e) { ....... }
}
b.addActionListener(new MyActionListener());

// (b) ActionListener를 상속받고 바로 메소드 작성, 동시에 new로 인스턴스 생성
b.addActionListener(«new ActionListener() {»
    public void actionPerformed(ActionEvent e) { ....... }
«});»`)}
        <div class="tip">수업(녹음 9:41~11:38) 방법 그대로: ① 클래스 이름(MyActionListener)을 <b>날린다</b> ② 이름이 없으니 new 뒤에 <b>부모 이름</b>(ActionListener, MouseAdapter 등)을 대신 쓴다 ③ 원래 클래스 몸체 { … }를 그 뒤에 통째로 넣는다 ④ 끝은 <b>${I('});')}</b>로 닫는다.</div>
        <h4>예제 9-3 익명 클래스로 Action 리스너 (27쪽)</h4>
        ${C(`
public class AnonymousClassListenerEx extends JFrame {
    public AnonymousClassListenerEx() {
        setTitle("Action 이벤트 리스너 작성");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        c.add(btn);

        «btn.addActionListener(new ActionListener() {»
            «public void actionPerformed(ActionEvent e) {»
                «JButton b = (JButton)e.getSource();»
                «if(b.getText().equals("Action"))»
                    «b.setText("액션");»
                «else»
                    «b.setText("Action");»
                «setTitle(b.getText());»  // 익명 클래스에서 JFrame의 멤버 호출 가능
            «}»
        «});»

        setSize(350, 150);
        setVisible(true);
    }
    public static void main(String [] args) {
        new AnonymousClassListenerEx();
    }
}`)}
        <div class="trap">함정: 익명 클래스 끝은 <b>${I('}')}로 클래스를 닫고 ${I(')')}로 addActionListener( 를 닫고 ${I(';')}</b>로 문장을 끝냅니다. ${I('new ActionListener()')}의 괄호 ${I('()')}도 빼먹기 쉽습니다.</div>`,
    },
    {
      id: 'mouse', title: '10. 예제 9-4 MouseListener (28~29쪽)',
      html: `
        <p>컨텐트팬의 아무 위치에 마우스 버튼을 누르면 마우스 포인트가 있는 위치로 "Hello" 문자열을 옮긴다.</p>
        ${C(`
import javax.swing.*;
import java.awt.event.*;
import java.awt.*;

public class MouseListenerEx extends JFrame {
    «private JLabel la = new JLabel("Hello");»

    public MouseListenerEx() {
        setTitle("Mouse 이벤트 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        «c.addMouseListener(new MyMouseListener());»

        c.setLayout(null);
        la.setSize(50, 20);
        la.setLocation(30, 30);
        c.add(la);

        setSize(250, 250);
        setVisible(true);
    }

    «class MyMouseListener implements MouseListener» {
        public void «mousePressed»(MouseEvent e) {
            «int x = e.getX();»   // 마우스 버튼이 눌러진 위치를 알아내어
            «int y = e.getY();»
            «la.setLocation(x, y);» // la("Hello")를 그 위치로 옮긴다
        }
        public void mouseReleased(MouseEvent e) {}
        public void mouseClicked(MouseEvent e) {}
        public void mouseEntered(MouseEvent e) {}
        public void mouseExited(MouseEvent e) {}
    }

    public static void main(String [] args) {
        new MouseListenerEx();
    }
}`)}
        <div class="tip">MyMouseListener가 MouseListenerEx <b>안에</b> 있는 내부 클래스라서 바깥의 ${I('la')}를 바로 쓸 수 있습니다. mousePressed 하나만 쓰는데도 <b>나머지 4개를 빈 몸체 {}로 모두 구현</b>해야 컴파일됩니다 → 이 부담을 없애는 게 어댑터.</div>`,
    },
    {
      id: 'adapter', title: '11. 어댑터(Adapter) 클래스 (30~34쪽)', prof: true,
      html: `
        <ul>
          <li>이벤트 리스너 구현에 따른 <b>부담을 해소</b>하기 위해 사용 (리스너 작성 시 추상 메소드들을 모두 구현해야 하는 부담)</li>
          <li><b>어댑터 클래스</b>: 리스너의 모든 메소드가 <b>단순 리턴하도록 구현</b>해 놓은 클래스</li>
          <li>추상 메소드가 <b>하나뿐인 리스너는 어댑터 클래스 없음</b> → <b>ActionAdapter, ItemAdapter는 존재하지 않음</b></li>
          <li>어댑터는 <b>클래스</b>라서 ${I('implements')}가 아니라 <b>${I('extends')}</b>로 상속, 필요한 메소드만 오버라이딩</li>
        </ul>
        ${C(`
class MouseAdapter implements MouseListener, MouseMotionListener, MouseWheelListener {
    public void mousePressed(MouseEvent e) { }   // ┐
    public void mouseReleased(MouseEvent e) { }  // │
    public void mouseClicked(MouseEvent e) { }   // │ MouseListener 메소드
    public void mouseEntered(MouseEvent e) { }   // │
    public void mouseExited(MouseEvent e) { }    // ┘
    public void mouseDragged(MouseEvent e) { }   // ┐ MouseMotionListener 메소드
    public void mouseMoved(MouseEvent e) { }     // ┘
    public void mouseWheelMoved(MouseWheelEvent e) { } // MouseWheelListener 메소드
}`)}
        <h4>JDK에서 제공하는 어댑터 클래스 (32쪽) ${P}</h4>
        ${table(['리스너 인터페이스', '대응하는 어댑터 클래스'], [
          { cells: [I('ActionListener'), '<b>없음</b>'], hl: true },
          { cells: [I('ItemListener'), '<b>없음</b>'], hl: true },
          { cells: [I('KeyListener'), I('KeyAdapter')] },
          { cells: [I('MouseListener'), I('MouseAdapter')], hl: true },
          { cells: [I('MouseMotionListener'), I('MouseMotionAdapter') + ' 혹은 ' + I('MouseAdapter')] },
          { cells: [I('FocusListener'), I('FocusAdapter')] },
          { cells: [I('WindowListener'), I('WindowAdapter')] },
          { cells: [I('AdjustmentListener'), '<b>없음</b>'] },
          { cells: [I('ComponentListener'), I('ComponentAdapter')] },
          { cells: [I('ContainerListener'), I('ContainerAdapter')] },
        ])}
        <h4>MouseListener → MouseAdapter (33쪽)</h4>
        ${C(`
// MouseListener를 이용한 경우: 5개 모두 구현
class MyMouseListener «implements MouseListener» {
    public void mousePressed(MouseEvent e) {
        int x = e.getX();
        int y = e.getY();
        la.setLocation(x, y);
    }
    public void mouseReleased(MouseEvent e) {}
    public void mouseClicked(MouseEvent e) {}
    public void mouseEntered(MouseEvent e) {}
    public void mouseExited(MouseEvent e) {}
}

// MouseAdapter를 이용한 경우: 필요한 것만
class MyMouseAdapter «extends MouseAdapter» {
    public void mousePressed(MouseEvent e) {
        int x = e.getX();
        int y = e.getY();
        la.setLocation(x, y);
    }
}`)}
        <h4>예제 9-5 MouseAdapter 사용하기 (34쪽)</h4>
        ${C(`
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class MouseAdapterEx extends JFrame {
    private JLabel la = new JLabel("Hello");

    public MouseAdapterEx() {
        setTitle("Mouse 이벤트 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        «c.addMouseListener(new MyMouseAdapter());»

        c.setLayout(null);
        la.setSize(50, 20);
        la.setLocation(30, 30);
        c.add(la);

        setSize(250, 250);
        setVisible(true);
    }

    «class MyMouseAdapter extends MouseAdapter {»
        «public void mousePressed(MouseEvent e) {»
            «int x = e.getX();»
            «int y = e.getY();»
            «la.setLocation(x, y);»
        «}»
    «}»

    public static void main(String [] args) {
        new MouseAdapterEx();
    }
}`)}
        <h4>같은 코드를 익명 클래스로 (수업 실습 응용)</h4>
        ${C(`
c.addMouseListener(«new MouseAdapter() {»
    public void mousePressed(MouseEvent e) {
        int x = e.getX();
        int y = e.getY();
        la.setLocation(x, y);
    }
«});»`)}`,
    },
    {
      id: 'compare', title: '12. 한눈에 비교',
      html: `
        ${table(['쓰는 법', '선언', '등록'], [
          { cells: ['독립 클래스', I('class MyActionListener implements ActionListener { … }') + ' (바깥에)', I('btn.addActionListener(new MyActionListener());')] },
          { cells: ['내부 클래스', I('private class MyActionListener implements ActionListener { … }') + ' (JFrame 클래스 안에)', I('btn.addActionListener(new MyActionListener());')], hl: true },
          { cells: ['익명 클래스', '선언 없음', I('btn.addActionListener(new ActionListener() { … });')], hl: true },
          { cells: ['어댑터 상속', I('class MyMouseAdapter extends MouseAdapter { … }'), I('c.addMouseListener(new MyMouseAdapter());')] },
        ])}
        <table class="m"><tr><th>예제</th><th>결과</th></tr>
          <tr><td>9-1 독립</td><td>Action 버튼 클릭 → "액션", 다시 클릭 → "Action"</td></tr>
          <tr><td>9-2 내부</td><td>9-1 + 버튼 문자열을 <b>타이틀</b>에 출력</td></tr>
          <tr><td>9-3 익명</td><td>9-2와 같음 (익명 클래스에서 setTitle 직접 호출)</td></tr>
          <tr><td>9-4 Mouse</td><td>마우스를 누른 위치로 "Hello" 레이블 이동</td></tr>
          <tr><td>9-5 Adapter</td><td>9-4와 같음 (mousePressed만 작성)</td></tr>
        </table>`,
    },
  ];

  const cards = [
    { q: '이벤트의 발생에 의해 프로그램 흐름이 결정되는 방식', a: '이벤트 기반 프로그래밍 (Event Driven Programming)', note: '반대: 배치 실행(batch programming)' },
    { q: '이벤트가 처리되는 과정 4단계', a: '이벤트 발생 → 이벤트 객체 생성 → 이벤트 리스너 찾기 → 이벤트 리스너 실행' },
    { q: '이벤트 소스', a: '이벤트를 발생시킨 GUI 컴포넌트', prof: true },
    { q: '이벤트 객체', a: '발생한 이벤트에 대한 정보를 가진 객체', prof: true },
    { q: '이벤트 리스너', a: '이벤트를 처리하는 코드, 클래스로 작성. 컴포넌트에 등록되어야 작동', prof: true },
    { q: '이벤트 분배 스레드', a: 'JVM에서 이벤트 발생을 통지받아 이벤트 객체를 만들고 리스너를 찾아 호출하는 무한 루프 스레드' },
    { q: '모든 이벤트 객체가 상속받는 클래스', a: 'java.util.EventObject' },
    { q: '이벤트 처리에 필요한 import 문', a: 'import java.awt.event.*;', note: '스윙 이벤트면 import javax.swing.event.*; 추가' },
    { q: '이벤트 소스를 알아내는 메소드 (시그니처)', a: 'Object getSource()', note: 'Object로 리턴 → (JButton)e.getSource() 다운캐스팅', prof: true },
    { q: '버튼 클릭, 메뉴 선택, 텍스트필드 <Enter> 시 이벤트 객체', a: 'ActionEvent', prof: true },
    { q: 'ActionEvent의 액션 문자열 얻기', a: 'String getActionCommand()' },
    { q: 'JCheckBox, JRadioButton 선택 상태 변경 시 이벤트 객체', a: 'ItemEvent' },
    { q: 'ActionListener의 추상 메소드', a: 'public void actionPerformed(ActionEvent e)', prof: true },
    { q: 'MouseListener의 추상 메소드 5개', a: 'mousePressed, mouseReleased, mouseClicked, mouseEntered, mouseExited' },
    { q: 'MouseMotionListener의 추상 메소드 2개', a: 'mouseDragged, mouseMoved' },
    { q: '마우스 위치 얻기 (MouseEvent)', a: 'e.getX(), e.getY()  또는 e.getPoint()' },
    { q: '리스너 작성 과정 3단계', a: '① 이벤트와 리스너 선택 ② 리스너 클래스 작성 ③ 리스너 등록', prof: true },
    { q: '컴포넌트에 리스너 등록하는 형식', a: 'component.addXXXListener(listener);', prof: true },
    { q: '버튼 btn에 MyActionListener 등록', a: 'btn.addActionListener(new MyActionListener());', prof: true },
    { q: '한 이벤트에 리스너 여러 개를 등록하면 실행 순서', a: '등록된 반대 순서로 모두 실행' },
    { q: '리스너 작성 방법 3가지', a: '독립 클래스, 내부 클래스, 익명 클래스', prof: true },
    { q: '독립 클래스가 적합한 경우', a: '리스너를 여러 곳에서 사용할 때' },
    { q: '내부 클래스가 적합한 경우 / 장점', a: '특정 클래스에서만 사용할 때 / 바깥 클래스 멤버에 접근 용이', prof: true },
    { q: '익명 클래스란', a: '이름이 없는 클래스. 클래스 정의 + 인스턴스 생성을 한번에 작성', prof: true },
    { q: '익명 클래스가 적합한 경우', a: '코드가 짧고 한 번만 사용하는 경우', prof: true },
    { q: '익명 ActionListener를 btn에 등록하는 뼈대', a: 'btn.addActionListener(new ActionListener() { public void actionPerformed(ActionEvent e) { … } });', prof: true },
    { q: '내부 클래스에서 바깥 JFrame의 타이틀 바꾸기 (예제 9-2)', a: 'InnerClassListenerEx.this.setTitle(b.getText());', note: '슬라이드 표기 InnerClassListener.this는 오타' },
    { q: '어댑터 클래스란', a: '리스너의 모든 메소드가 단순 리턴하도록 구현해 놓은 클래스', prof: true },
    { q: '어댑터 클래스가 없는 리스너', a: 'ActionListener, ItemListener, AdjustmentListener', note: '추상 메소드가 하나뿐이라서', prof: true },
    { q: 'MouseListener / KeyListener / WindowListener의 어댑터', a: 'MouseAdapter / KeyAdapter / WindowAdapter', prof: true },
    { q: '어댑터를 상속할 때 키워드', a: 'extends (어댑터는 클래스)', note: '리스너 인터페이스는 implements', prof: true },
  ];

  // 코드 빈칸 문제에 공통으로 붙는 import 부분
  const IMP = 'import javax.swing.*;\nimport java.awt.event.*;\nimport java.awt.*;\n\n';

  const quiz = [
    // 코드 빈칸
    { id: 'c1', prof: true, type: 'code', q: '예제 9-1: 독립 클래스로 Action 리스너를 작성하고 버튼에 등록하세요.',
      code: IMP + `public class IndepClassListenerEx extends JFrame {
    public IndepClassListenerEx() {
        setTitle("Action 이벤트 리스너 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        btn.{{1}}(new MyActionListener());
        c.add(btn);
        setSize(350, 150);
        setVisible(true);
    }
    public static void main(String [] args) {
        new IndepClassListenerEx();
    }
}
class MyActionListener {{2}} {{3}} {
    public void {{4}}(ActionEvent e) {
        JButton b = {{5}}e.{{6}}();
        if(b.getText().equals("Action"))
            b.setText("액션");
        else
            b.setText("Action");
    }
}`,
      blanks: ['addActionListener', 'implements', 'ActionListener', 'actionPerformed', '(JButton)', 'getSource'],
      explain: '리스너는 ActionListener 인터페이스를 implements하고 actionPerformed()를 구현합니다. getSource()는 Object를 리턴하므로 (JButton)으로 다운캐스팅합니다. 등록은 btn.addActionListener(리스너 객체).' },
    { id: 'c2', prof: true, type: 'code', q: '예제 9-2: 내부 클래스로 Action 리스너를 작성하고, 버튼 문자열을 타이틀에 출력하세요.',
      code: IMP + `public class InnerClassListenerEx extends JFrame {
    public InnerClassListenerEx() {
        setTitle("Action 이벤트 리스너 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        btn.addActionListener(new {{1}}());
        c.add(btn);
        setSize(350, 150);
        setVisible(true);
    }
    {{2}} class MyActionListener implements ActionListener {
        public void actionPerformed({{3}} e) {
            JButton b = (JButton)e.getSource();
            if(b.getText().equals("Action"))
                b.setText("액션");
            else
                b.setText("Action");
            {{4}}.this.setTitle(b.{{5}}());
        }
    }
    public static void main(String [] args) {
        new InnerClassListenerEx();
    }
}`,
      blanks: ['MyActionListener', 'private', 'ActionEvent', ['InnerClassListenerEx', 'InnerClassListener'], 'getText'],
      explain: '내부 클래스는 private으로 선언해 바깥에서 못 쓰게 합니다. 바깥클래스이름.this가 바깥 JFrame 객체입니다. 슬라이드엔 InnerClassListener.this로 적혀 있어 그것도 정답 처리했지만, 실제로는 클래스 이름인 InnerClassListenerEx여야 컴파일됩니다.' },
    { id: 'c3', prof: true, type: 'code', q: '예제 9-3: 익명 클래스로 Action 리스너를 만들어 버튼에 바로 등록하세요.',
      code: IMP + `public class AnonymousClassListenerEx extends JFrame {
    public AnonymousClassListenerEx() {
        setTitle("Action 이벤트 리스너 작성");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.setLayout(new FlowLayout());
        JButton btn = new JButton("Action");
        c.add(btn);

        btn.addActionListener({{1}} {{2}}() {
            public void {{3}}(ActionEvent e) {
                JButton b = (JButton)e.getSource();
                if(b.getText().equals("Action"))
                    b.setText("액션");
                else
                    b.setText("Action");
                {{4}}(b.getText());
            }
        }{{5}}

        setSize(350, 150);
        setVisible(true);
    }
    public static void main(String [] args) {
        new AnonymousClassListenerEx();
    }
}`,
      blanks: ['new', 'ActionListener', 'actionPerformed', 'setTitle', ');'],
      explain: '익명 클래스는 new 부모이름() { … } 형태로 클래스 정의와 객체 생성을 한번에 합니다. 끝은 }로 클래스를 닫고 );로 addActionListener( 를 닫습니다. 익명 클래스 안에서도 JFrame의 setTitle()을 바로 부를 수 있습니다.' },
    { id: 'c4', prof: true, type: 'code', q: '예제 9-4의 리스너를 완성하세요. 마우스를 누른 위치로 "Hello" 레이블을 옮깁니다.',
      code: IMP + `public class MouseListenerEx extends JFrame {
    private JLabel la = new JLabel("Hello");

    public MouseListenerEx() {
        setTitle("Mouse 이벤트 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.{{1}}(new MyMouseListener());
        c.setLayout(null);
        la.setSize(50, 20);
        la.setLocation(30, 30);
        c.add(la);
        setSize(250, 250);
        setVisible(true);
    }

    class MyMouseListener implements {{2}} {
        public void {{3}}(MouseEvent e) {
            int x = e.{{4}}();
            int y = e.{{5}}();
            la.{{6}}(x, y);
        }
        public void mouseReleased(MouseEvent e) {}
        public void {{7}}(MouseEvent e) {}
        public void mouseEntered(MouseEvent e) {}
        public void {{8}}(MouseEvent e) {}
    }

    public static void main(String [] args) {
        new MouseListenerEx();
    }
}`,
      blanks: ['addMouseListener', 'MouseListener', 'mousePressed', 'getX', 'getY', 'setLocation', 'mouseClicked', 'mouseExited'],
      explain: 'MouseListener는 mousePressed, mouseReleased, mouseClicked, mouseEntered, mouseExited 5개를 모두 구현해야 합니다. 쓰지 않는 것도 빈 몸체 {}로 둡니다. 위치는 e.getX(), e.getY().' },
    { id: 'c5', prof: true, type: 'code', q: '예제 9-5: MouseAdapter를 이용해 필요한 메소드만 작성하세요.',
      code: IMP + `public class MouseAdapterEx extends JFrame {
    private JLabel la = new JLabel("Hello");

    public MouseAdapterEx() {
        setTitle("Mouse 이벤트 예제");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        Container c = getContentPane();
        c.addMouseListener(new {{1}}());
        c.setLayout(null);
        la.setSize(50, 20);
        la.setLocation(30, 30);
        c.add(la);
        setSize(250, 250);
        setVisible(true);
    }

    class MyMouseAdapter {{2}} {{3}} {
        public void {{4}}(MouseEvent e) {
            int x = e.getX();
            int y = e.getY();
            la.setLocation(x, y);
        }
    }

    public static void main(String [] args) {
        new MouseAdapterEx();
    }
}`,
      blanks: ['MyMouseAdapter', 'extends', 'MouseAdapter', 'mousePressed'],
      explain: '어댑터는 클래스라서 implements가 아니라 extends로 상속합니다. 필요한 mousePressed()만 오버라이딩하면 됩니다.' },
    { id: 'c6', prof: true, type: 'code', q: '예제 9-5의 리스너를 익명 클래스로 바꿔 등록하세요. (수업 실습 응용)',
      code: IMP + `public class MouseAnonEx extends JFrame {
    private JLabel la = new JLabel("Hello");

    public MouseAnonEx() {
        Container c = getContentPane();
        c.addMouseListener({{1}} {{2}}() {
            public void {{3}}(MouseEvent e) {
                int x = e.getX();
                int y = e.getY();
                la.setLocation(x, y);
            }
        }{{4}}
        c.setLayout(null);
        la.setSize(50, 20);
        la.setLocation(30, 30);
        c.add(la);
        setSize(250, 250);
        setVisible(true);
    }
}`,
      blanks: ['new', 'MouseAdapter', 'mousePressed', ');'],
      explain: '이름(MyMouseAdapter)을 없애고 new 뒤에 부모 이름 MouseAdapter를 씁니다. 녹음 10:40 "이름 없앴으니까 … 부모 이름을 대신 쓴다". MouseListener로 쓰면 5개를 다 구현해야 하므로 어댑터를 씁니다.' },
    { id: 'c7', prof: true, type: 'code', q: '리스너 작성 3단계 (19~20쪽): 리스너를 만들고 버튼에 등록하세요.',
      code: IMP + `// 2. 이벤트 리스너 클래스 작성
class MyActionListener {{1}} ActionListener {
    public void actionPerformed(ActionEvent e) {
        JButton b = (JButton)e.getSource();
        if(b.getText().equals("Action"))
            b.setText("액션");
        else
            b.setText("Action");
    }
}
public class ListenerSteps {
    public static void main(String [] args) {
        // 3. 이벤트 리스너 등록
        JButton btn = new JButton("버튼");
        MyActionListener listener = {{2}} MyActionListener();
        btn.{{3}}({{4}});
    }
}`,
      blanks: ['implements', 'new', 'addActionListener', 'listener'],
      explain: '리스너 등록 형식은 component.addXXXListener(listener). XXX는 이벤트 이름(Action), listener는 리스너 객체입니다.' },
    { id: 'c8', prof: true, type: 'code', q: '이벤트 객체에서 정보를 꺼내세요. (12~13쪽)',
      code: IMP + `class InfoListener implements ActionListener {
    public void actionPerformed(ActionEvent e) {
        Object obj = e.{{1}}();            // 이벤트 소스 (Object 타입)
        JButton b = {{2}}e.getSource();     // 다운캐스팅해서 사용
        String cmd = e.{{3}}();             // 액션 문자열
    }
}
class InfoMouse extends MouseAdapter {
    public void mousePressed(MouseEvent e) {
        int x = e.getX(), y = e.getY();     // 마우스 위치
        Point p = e.{{4}}();                // 마우스 위치 (Point)
        int n = e.{{5}}();                  // 클릭 횟수
        int btn = e.{{6}}();                // 눌러진 마우스 버튼 번호
    }
}`,
      blanks: ['getSource', '(JButton)', 'getActionCommand', 'getPoint', 'getClickCount', 'getButton'],
      explain: 'getSource()는 EventObject의 메소드라 모든 이벤트 객체에 있고, Object로 리턴하므로 다운캐스팅합니다. ActionEvent는 getActionCommand(), MouseEvent는 getX/getY/getPoint/getClickCount/getButton.' },
    { id: 'c9', type: 'code', q: '컴포넌트에 여러 종류의 리스너를 등록하세요. (21쪽)',
      code: `import java.awt.event.*;
import javax.swing.*;

class MyActionListener implements ActionListener {
    public void actionPerformed(ActionEvent e) { }
}
class MyKeyListener extends KeyAdapter { }
class MyFocusListener extends FocusAdapter { }
class MyMouseListener extends MouseAdapter { }

public class AddListeners {
    public static void main(String [] args) {
        JButton btn = new JButton("버튼");
        btn.{{1}}(new MyActionListener());  // Action 리스너
        btn.{{2}}(new MyKeyListener());     // Key 리스너
        btn.{{3}}(new MyFocusListener());   // Focus 리스너
        btn.{{4}}(new MyMouseListener());   // Mouse 리스너
    }
}`,
      blanks: ['addActionListener', 'addKeyListener', 'addFocusListener', 'addMouseListener'],
      explain: '등록 메소드가 addXXXListener인 이유: 컴포넌트는 서로 다른 이벤트에 대한 리스너를 동시에 가질 수 있기 때문입니다.' },

    // 단답형
    { id: 's1', prof: true, type: 'short', q: '이벤트를 발생시킨 GUI 컴포넌트를 무엇이라 하나?', answers: ['이벤트 소스', 'event source', '이벤트소스'],
      explain: '예: 버튼을 클릭하면 이벤트 소스는 JButton.' },
    { id: 's2', prof: true, type: 'short', q: '이벤트를 처리하는 코드로, 클래스로 작성하고 컴포넌트에 등록되어야 작동하는 것은?', answers: ['이벤트 리스너', 'event listener', '리스너', 'listener'],
      explain: '등록: component.addXXXListener(listener)' },
    { id: 's3', prof: true, type: 'short', q: '발생한 이벤트에 관한 정보(종류, 소스, 좌표 등)를 저장해 리스너에 전달되는 객체는?', answers: ['이벤트 객체', 'event object', '이벤트객체'],
      explain: '모든 이벤트 객체는 java.util.EventObject를 상속받습니다.' },
    { id: 's4', type: 'short', q: 'JVM으로부터 이벤트 발생을 통지받아 이벤트 객체를 만들고 리스너를 찾아 호출하는, 무한 루프를 실행하는 스레드는?', answers: ['이벤트 분배 스레드', '이벤트분배스레드', 'event dispatch thread', 'EDT'],
      explain: '8쪽: 이벤트 분배 스레드.' },
    { id: 's5', prof: true, type: 'short', q: '버튼을 클릭했을 때 생성되는 이벤트 객체의 클래스 이름은?', answers: ['ActionEvent'],
      explain: 'JButton 선택, JMenuItem 선택, JTextField에서 <Enter> 입력 시 ActionEvent가 발생합니다.' },
    { id: 's6', prof: true, type: 'short', q: 'ActionListener 인터페이스에서 개발자가 구현해야 하는 메소드 이름은?', answers: ['actionPerformed', 'void actionPerformed(ActionEvent e)', 'public void actionPerformed(ActionEvent e)'],
      explain: 'public void actionPerformed(ActionEvent e) 하나뿐이라 ActionAdapter가 없습니다.' },
    { id: 's7', prof: true, type: 'short', q: '이벤트 객체에서 이벤트를 발생시킨 소스 컴포넌트를 알아내는 메소드 이름은?', answers: ['getSource', 'Object getSource()', 'e.getSource'],
      explain: 'Object 타입으로 리턴하므로 (JButton)e.getSource()처럼 다운캐스팅합니다.' },
    { id: 's8', prof: true, type: 'short', q: '이름이 없이, 클래스 정의와 인스턴스 생성을 한번에 작성하는 클래스를 무엇이라 하나?', answers: ['익명 클래스', '익명클래스', 'anonymous class', 'anonymous', '익명 클래스(anonymous class)'],
      explain: '코드가 짧고 한 번만 사용하는 경우에 이용합니다.' },
    { id: 's9', prof: true, type: 'short', q: '클래스 안에 멤버처럼 작성하는 클래스로, 바깥 클래스의 멤버에 접근하기 쉬운 것은?', answers: ['내부 클래스', '내부클래스', 'inner class', 'innerclass', '내부 클래스(inner class)'],
      explain: '리스너를 특정 클래스에서만 사용할 때 적합합니다. 예제 9-2.' },
    { id: 's10', prof: true, type: 'short', q: '리스너의 모든 메소드가 단순 리턴하도록 구현해 놓은 클래스를 무엇이라 하나?', answers: ['어댑터 클래스', '어댑터', 'adapter', 'adapter class', '어댑터클래스'],
      explain: '리스너의 추상 메소드를 모두 구현해야 하는 부담을 덜어 줍니다.' },
    { id: 's11', prof: true, type: 'short', q: 'MouseListener에 대응하는 어댑터 클래스의 이름은?', answers: ['MouseAdapter'],
      explain: 'MouseAdapter는 MouseListener, MouseMotionListener, MouseWheelListener를 모두 구현합니다.' },
    { id: 's12', type: 'short', q: '모든 이벤트 객체가 상속받는 클래스의 이름은?', answers: ['EventObject', 'java.util.EventObject'],
      explain: 'getSource()가 이 클래스의 메소드입니다.' },
    { id: 's13', type: 'short', q: '이벤트 기반 프로그래밍의 반대 개념으로, 개발자가 프로그램의 흐름을 결정하는 방식은?', answers: ['배치 실행', 'batch programming', '배치', '배치 프로그래밍', 'batch'],
      explain: '이벤트 기반 프로그래밍은 이벤트 발생에 의해 흐름이 결정됩니다.' },

    // 객관식
    { id: 'm1', type: 'mcq', q: '이벤트가 처리되는 과정을 순서대로 나열한 것은?',
      choices: ['이벤트 발생 → 이벤트 객체 생성 → 리스너 찾기 → 리스너 실행', '이벤트 객체 생성 → 이벤트 발생 → 리스너 실행 → 리스너 찾기', '리스너 찾기 → 이벤트 발생 → 이벤트 객체 생성 → 리스너 실행', '이벤트 발생 → 리스너 실행 → 이벤트 객체 생성 → 리스너 찾기'], answer: 0,
      explain: '6쪽: 이벤트 발생 → 이벤트 객체 생성 → 이벤트 리스너 찾기 → 이벤트 리스너 실행(이벤트 객체 전달).' },
    { id: 'm2', prof: true, type: 'mcq', q: '어댑터 클래스가 존재하지 않는 리스너는?',
      choices: ['ActionListener', 'MouseListener', 'KeyListener', 'WindowListener'], answer: 0,
      explain: 'ActionListener, ItemListener, AdjustmentListener는 어댑터가 없습니다.' },
    { id: 'm3', prof: true, type: 'mcq', q: 'ActionAdapter 클래스가 존재하지 않는 이유는?',
      choices: ['ActionListener의 추상 메소드가 하나뿐이라서', 'ActionEvent는 스윙에서 쓰지 않아서', 'ActionListener는 클래스라서', 'ActionListener는 익명 클래스로만 쓸 수 있어서'], answer: 0,
      explain: '31쪽: 추상 메소드가 하나뿐인 리스너는 어댑터 클래스가 없습니다. 구현 부담이 없으니까요.' },
    { id: 'm4', type: 'mcq', mono: true, q: 'MouseListener 인터페이스의 메소드가 아닌 것은?',
      choices: ['mouseDragged()', 'mousePressed()', 'mouseEntered()', 'mouseExited()'], answer: 0,
      explain: 'mouseDragged, mouseMoved는 MouseMotionListener의 메소드입니다.' },
    { id: 'm5', prof: true, type: 'mcq', q: '익명 클래스로 리스너를 작성하기에 가장 알맞은 경우는?',
      choices: ['리스너 코드가 짧고 한 번만 사용할 때', '리스너를 여러 클래스에서 공유할 때', '리스너를 별도 파일로 관리할 때', '리스너 메소드가 많고 복잡할 때'], answer: 0,
      explain: '여러 곳에서 쓰면 독립 클래스, 특정 클래스에서만 쓰면 내부 클래스가 적합합니다.' },
    { id: 'm6', prof: true, type: 'mcq', q: '예제 9-2처럼 리스너를 내부 클래스로 작성할 때의 장점은?',
      choices: ['바깥 클래스(JFrame)의 멤버에 쉽게 접근할 수 있다', '다른 클래스에서도 자유롭게 쓸 수 있다', '추상 메소드를 구현하지 않아도 된다', '이벤트 분배 스레드가 필요 없다'], answer: 0,
      explain: '24쪽: 리스너에서 InnerClassListenerEx의 멤버(setTitle 등)에 대한 접근 용이. private으로 선언해 외부에서는 못 씁니다.' },
    { id: 'm7', prof: true, type: 'mcq', mono: true, q: '버튼 btn에 리스너 객체 listener를 등록하는 코드는?',
      choices: ['btn.addActionListener(listener);', 'btn.setActionListener(listener);', 'listener.addActionListener(btn);', 'btn.add(listener);'], answer: 0,
      explain: 'component.addXXXListener(listener) 형식입니다.' },
    { id: 'm8', prof: true, type: 'mcq', q: 'getSource()에 대한 설명으로 틀린 것은?',
      choices: ['ActionEvent에만 있는 메소드다', 'EventObject 클래스의 메소드다', 'Object 타입으로 리턴한다', '보통 다운캐스팅하여 사용한다'], answer: 0,
      explain: 'getSource()는 EventObject의 메소드라 모든 이벤트 객체에 적용됩니다.' },
    { id: 'm9', type: 'mcq', mono: true, q: '이벤트 소스와 발생하는 이벤트 객체의 짝이 틀린 것은?',
      choices: ['JScrollBar – KeyEvent', 'JButton – ActionEvent', 'JCheckBox – ItemEvent', 'JList – ListSelectionEvent'], answer: 0,
      explain: '스크롤바를 움직이면 AdjustmentEvent가 발생합니다.' },
    { id: 'm10', type: 'mcq', q: '한 버튼에 ActionListener를 3개 등록하고 버튼을 클릭하면?',
      choices: ['등록된 반대 순서로 3개 모두 실행된다', '마지막에 등록한 1개만 실행된다', '처음 등록한 1개만 실행된다', '컴파일 오류가 난다'], answer: 0,
      explain: '21쪽: 컴포넌트는 한 이벤트에 여러 리스너를 가질 수 있고, 등록된 반대 순서로 모두 실행됩니다.' },
    { id: 'm11', prof: true, type: 'mcq', mono: true, q: 'MouseAdapter를 상속받는 리스너 선언으로 올바른 것은?',
      choices: ['class MyMouseAdapter extends MouseAdapter', 'class MyMouseAdapter implements MouseAdapter', 'class MyMouseAdapter extends MouseListener', 'interface MyMouseAdapter extends MouseAdapter'], answer: 0,
      explain: '어댑터는 클래스라서 extends, 리스너 인터페이스는 implements입니다.' },
    { id: 'm12', prof: true, type: 'mcq', mono: true, q: '익명 클래스로 ActionListener를 등록하는 코드로 올바른 것은?',
      choices: ['btn.addActionListener(new ActionListener() { public void actionPerformed(ActionEvent e) { } });', 'btn.addActionListener(new ActionListener { public void actionPerformed(ActionEvent e) { } });', 'btn.addActionListener(class ActionListener() { public void actionPerformed(ActionEvent e) { } });', 'btn.addActionListener(new ActionListener() { public void actionPerformed(ActionEvent e) { } })'], answer: 0,
      explain: 'new 부모이름() { … } 이고, 마지막은 });로 끝납니다. ()를 빼거나 class를 쓰거나 ;를 빼면 컴파일 오류입니다.' },

    // 출력(동작) 예측
    { id: 'u1', prof: true, type: 'output', q: '예제 9-1 실행 후 "Action" 버튼을 세 번 클릭하면 버튼의 문자열은?',
      code: 'JButton b = (JButton)e.getSource();\nif(b.getText().equals("Action"))\n    b.setText("액션");\nelse\n    b.setText("Action");',
      choices: ['액션', 'Action', 'Action 이벤트 리스너 예제', '변하지 않는다'], answer: 0,
      explain: '클릭할 때마다 Action → 액션 → Action → 액션으로 바뀝니다. 세 번이면 "액션".' },
    { id: 'u2', prof: true, type: 'output', q: '예제 9-2 실행 후 버튼을 한 번 클릭하면 윈도우 타이틀은?',
      code: 'if(b.getText().equals("Action"))\n    b.setText("액션");\nelse\n    b.setText("Action");\nInnerClassListenerEx.this.setTitle(b.getText());',
      choices: ['액션', 'Action', 'Action 이벤트 리스너 예제', 'InnerClassListenerEx'], answer: 0,
      explain: '버튼 문자열이 "액션"으로 바뀐 뒤 그 문자열을 타이틀에 넣습니다.' },
    { id: 'u3', type: 'output', q: '예제 9-4에서 컨텐트팬의 (100, 50) 위치를 마우스로 누르면 "Hello" 레이블의 위치는?',
      code: 'public void mousePressed(MouseEvent e) {\n    int x = e.getX();\n    int y = e.getY();\n    la.setLocation(x, y);\n}',
      choices: ['(100, 50)', '(30, 30)', '(50, 20)', '(130, 80)'], answer: 0,
      explain: 'getX(), getY()는 컴포넌트 내 좌표이고 setLocation(x, y)로 레이블을 그 위치로 옮깁니다. (30, 30)은 처음 위치.' },

    // 오류 찾기
    { id: 'e1', prof: true, type: 'error', mono: true, q: 'MouseListener를 구현한 아래 리스너가 컴파일 오류가 나는 이유는?',
      code: 'class MyMouseListener implements MouseListener {\n    public void mousePressed(MouseEvent e) {\n        la.setLocation(e.getX(), e.getY());\n    }\n}',
      choices: ['나머지 4개 추상 메소드를 구현하지 않았다', 'implements 대신 extends를 써야 한다', 'mousePressed의 매개변수가 ActionEvent여야 한다', 'getX()는 MouseEvent에 없다'], answer: 0,
      explain: '인터페이스를 구현하면 모든 추상 메소드를 구현해야 합니다. mousePressed만 쓰고 싶으면 extends MouseAdapter.' },

    // OX
    { id: 'o1', type: 'ox', q: '이벤트 리스너는 컴포넌트에 등록되어야 작동한다.',
      choices: ['O', 'X'], answer: 0, explain: '8쪽: 컴포넌트에 등록되어야 작동 가능.' },
    { id: 'o2', type: 'ox', q: 'MouseAdapter를 상속받으면 mousePressed()만 작성해도 컴파일된다.',
      choices: ['O', 'X'], answer: 0, explain: '어댑터가 모든 메소드를 빈 몸체로 구현해 두었기 때문입니다.' },
    { id: 'o3', type: 'ox', q: 'JDK에는 ActionAdapter 클래스와 ItemAdapter 클래스가 있다.',
      choices: ['O', 'X'], answer: 1, explain: '31쪽: ActionAdapter, ItemAdapter 클래스는 존재하지 않습니다.' },
    { id: 'o4', type: 'ox', q: '하나의 컴포넌트는 Action 리스너와 Key 리스너를 동시에 가질 수 있다.',
      choices: ['O', 'X'], answer: 0, explain: '21쪽: 서로 다른 이벤트에 대한 리스너들을 동시에 가질 수 있습니다.' },
    { id: 'o5', type: 'ox', q: '모든 이벤트 객체는 java.util.EventObject를 상속받는다.',
      choices: ['O', 'X'], answer: 0, explain: '9쪽.' },
  ];

  window.CHAPTER_DATA = window.CHAPTER_DATA || {};
  window.CHAPTER_DATA['09'] = { sections, cards, quiz };
})();
