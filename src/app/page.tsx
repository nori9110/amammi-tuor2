import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressSection } from '@/components/progress/ProgressSection';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { MembersSection } from '@/components/tour/MembersSection';
import { NoticeSection } from '@/components/tour/NoticeSection';
import { RolesSection } from '@/components/tour/RolesSection';
import { tourConductor, packingList, reflectionMeeting, purposes } from '@/lib/data';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ヒーローセクション */}
      <section id="hero" className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 text-pastel-800 dark:text-pastel-100">奄美大島旅行しおり</h1>
        <p className="text-lg text-pastel-900 dark:text-pastel-50">
          参加メンバー間で旅行工程の進捗を共有し、GoogleMapを用いた案内機能を提供します
        </p>
      </section>

      {/* 進捗状況セクション */}
      <section id="progress-section">
        <ProgressSection />
      </section>

      {/* 旅の目的 */}
      <section id="purpose" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>旅の目的</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {purposes.map((purpose, index) => (
                <li key={index} className="text-pastel-900 dark:text-pastel-50">
                  {purpose}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* ツアーコンダクター */}
      <section id="conductor" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ツアーコンダクター</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pastel-900 dark:text-pastel-50">
              <strong>担当者:</strong> {tourConductor.name}
            </p>
            <p className="text-pastel-900 dark:text-pastel-50">
              <strong>連絡先:</strong> {tourConductor.contact}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 持ち物セクション */}
      <section id="packing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>持ち物</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {packingList.map((item, index) => (
                <li key={index} className="text-pastel-900 dark:text-pastel-50">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* 反省会情報 */}
      <section id="reflection" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>反省会情報</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pastel-900 dark:text-pastel-50">
              <strong>日時:</strong> {reflectionMeeting.date} {reflectionMeeting.time}
            </p>
            <p className="text-pastel-900 dark:text-pastel-50">
              <strong>場所:</strong> {reflectionMeeting.location}
            </p>
            <p className="text-pastel-900 dark:text-pastel-50">
              <strong>参加者:</strong> {reflectionMeeting.participants}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ツアー内容セクション */}
      <section id="tour-content" className="py-8 space-y-8">
        <h2 className="text-3xl font-bold text-pastel-800 dark:text-pastel-100">ツアー内容</h2>
        <MembersSection />
        <RolesSection />
      </section>

      {/* 注意事項（ツアー内容セクション内に移動） */}
      <NoticeSection />

      <ScrollToTop />
    </div>
  );
}

