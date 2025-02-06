import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">隐私政策</h1>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">信息收集</h2>
            <p className="text-gray-600 leading-relaxed">
              我们收集的信息仅限于：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>您的钱包地址</li>
              <li>您的SNS名称</li>
              <li>您的投票记录</li>
              <li>您的提案记录</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">信息使用</h2>
            <p className="text-gray-600 leading-relaxed">
              我们使用收集的信息用于：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>验证您的节点身份</li>
              <li>记录投票结果</li>
              <li>统计参与度</li>
              <li>改进社区治理</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">信息保护</h2>
            <p className="text-gray-600 leading-relaxed">
              我们采取以下措施保护您的信息：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>所有数据存储在去中心化网络上</li>
              <li>使用加密技术保护敏感信息</li>
              <li>定期安全审计</li>
              <li>严格的访问控制</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">信息共享</h2>
            <p className="text-gray-600 leading-relaxed">
              我们不会与第三方共享您的个人信息，除非：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>获得您的明确授权</li>
              <li>法律要求</li>
              <li>保护社区安全</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie使用</h2>
            <p className="text-gray-600 leading-relaxed">
              我们使用Cookie来：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>保持您的登录状态</li>
              <li>记住您的偏好设置</li>
              <li>提供更好的用户体验</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">您的权利</h2>
            <p className="text-gray-600 leading-relaxed">
              您拥有以下权利：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>访问您的个人信息</li>
              <li>更正不准确的信息</li>
              <li>要求删除您的信息</li>
              <li>反对信息处理</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">政策更新</h2>
            <p className="text-gray-600 leading-relaxed">
              我们可能会不时更新本隐私政策。重大变更时，我们会：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>在网站显著位置发布通知</li>
              <li>通过社区渠道通知用户</li>
              <li>获取必要的同意</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-gray-600 leading-relaxed">
              如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Discord: <a href="https://discord.gg/seedao" className="text-primary-600 hover:text-primary-700">https://discord.gg/seedao</a></li>
              <li>Twitter: <a href="https://twitter.com/seedao_xyz" className="text-primary-600 hover:text-primary-700">@seedao_xyz</a></li>
              <li>Mirror: <a href="https://mirror.xyz/seedao.eth" className="text-primary-600 hover:text-primary-700">seedao.eth</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}