import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressSection } from '@/components/progress/ProgressSection';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { tourConductor, packingList, reflectionMeeting, purposes, notices } from '@/lib/data';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* ヒーローセクション */}
      <section id="hero" className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">奄美大島旅行しおり</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
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
                <li key={index} className="text-gray-700 dark:text-gray-300">
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
            <p className="text-gray-700 dark:text-gray-300">
              <strong>担当者:</strong> {tourConductor.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
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
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* 注意事項 */}
      <section id="notices" className="space-y-4">
        <Card className="border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle>注意事項</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {notices.map((notice, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {notice}
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
            <p className="text-gray-700 dark:text-gray-300">
              <strong>日時:</strong> {reflectionMeeting.date} {reflectionMeeting.time}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>場所:</strong> {reflectionMeeting.location}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>参加者:</strong> {reflectionMeeting.participants}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ツアー内容セクション（ナビゲーション用） */}
      <section id="tour-content" className="py-8">
        <h2 className="text-3xl font-bold mb-6">ツアー内容</h2>
        <p className="text-gray-600 dark:text-gray-400">
          詳細なツアー内容は「ツアー内容」ページをご確認ください。
        </p>
      </section>

      <ScrollToTop />
    </div>
  );
}

