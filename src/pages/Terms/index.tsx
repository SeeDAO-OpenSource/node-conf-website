import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">使用条款</h1>
        
        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">接受条款</h2>
            <p className="text-gray-600 leading-relaxed">
              通过访问和使用SeeDAO节点共识大会网站，您同意遵守这些条款和条件。如果您不同意这些条款的任何部分，请不要使用本网站。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">使用许可</h2>
            <p className="text-gray-600 leading-relaxed">
              在遵守这些条款的前提下，我们授予您访问和使用本网站的有限许可。此许可：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>不可转让</li>
              <li>仅供个人使用</li>
              <li>不包括商业用途</li>
              <li>可随时撤销</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">用户责任</h2>
            <p className="text-gray-600 leading-relaxed">
              作为用户，您同意：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>遵守所有适用法律和法规</li>
              <li>不干扰网站的正常运行</li>
              <li>不从事任何可能损害社区利益的行为</li>
              <li>保护您的账户安全</li>
              <li>对您的行为负责</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">知识产权</h2>
            <p className="text-gray-600 leading-relaxed">
              本网站的所有内容，包括但不限于：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>文本</li>
              <li>图像</li>
              <li>代码</li>
              <li>标志</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              均受知识产权法保护。未经明确许可，不得复制、分发或使用。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">免责声明</h2>
            <p className="text-gray-600 leading-relaxed">
              本网站按"原样"提供，我们：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>不保证网站始终可用</li>
              <li>不对任何损失负责</li>
              <li>保留随时修改或终止服务的权利</li>
              <li>不对第三方内容负责</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">隐私政策</h2>
            <p className="text-gray-600 leading-relaxed">
              使用本网站即表示您同意我们的隐私政策。您可以在
              <a href="/privacy" className="text-primary-600 hover:text-primary-700 mx-1">
                隐私政策
              </a>
              页面了解更多信息。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">条款修改</h2>
            <p className="text-gray-600 leading-relaxed">
              我们保留随时修改这些条款的权利。修改后的条款将在网站上发布。继续使用本网站即表示您接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">终止</h2>
            <p className="text-gray-600 leading-relaxed">
              我们保留以下权利：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>随时终止或暂停您的访问权限</li>
              <li>无需事先通知</li>
              <li>因任何原因或无原因</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">联系方式</h2>
            <p className="text-gray-600 leading-relaxed">
              如有任何问题，请通过以下方式联系我们：
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