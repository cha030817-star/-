import { Coins, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 gold-gradient rounded flex items-center justify-center">
                <Coins className="text-black" size={20} />
              </div>
              <span className="text-lg font-bold gold-text-gradient">국제퍼스트 금거래소</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              국제퍼스트 금거래소는 최고의 가치와 신뢰를 바탕으로 
              고객님의 소중한 자산을 지켜드립니다. 
              국가공인 감정사가 상주하는 믿을 수 있는 거래소입니다.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">주요 메뉴</h5>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#prices" className="hover:text-gold transition-colors">실시간 시세조회</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">주요 서비스 안내</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">골드바/실버바 구매</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">기업 상담 문의</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">고객 지원</h5>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-gold transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">공지사항</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Contact Us</h5>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold shrink-0" />
                <span>서울특별시 종로구 돈화문로 5가길 1 <br />피카디리빌딩 1층</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span>1588-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span>contact@firstgold.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© 2026 국제퍼스트 금거래소 Co., Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span>사업자등록번호: 123-45-67890</span>
            <span>대표이사: 홍길동</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
